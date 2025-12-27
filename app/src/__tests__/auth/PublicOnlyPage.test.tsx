/**
 * Tests for PublicOnlyPage component
 *
 * Test Coverage:
 * - Shows loading state while auth is undefined
 * - Redirects authenticated users to /dashboard
 * - Shows children for unauthenticated users
 * - Supports custom loading component
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { PublicOnlyPage } from "@/components/auth/PublicOnlyPage";

// Mock useAuthRedirect hook
vi.mock("@/hooks/useAuthRedirect", () => ({
  useAuthRedirect: vi.fn(),
}));

// Import mocked module
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

describe("PublicOnlyPage", () => {
  const mockUseAuthRedirect = useAuthRedirect as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state while auth is loading", () => {
    mockUseAuthRedirect.mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
      user: undefined,
    });

    render(
      <PublicOnlyPage>
        <div>Page Content</div>
      </PublicOnlyPage>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText("Page Content")).not.toBeInTheDocument();
  });

  it("should show loading state when authenticated (during redirect)", () => {
    mockUseAuthRedirect.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { _id: "user123", email: "test@example.com" },
    });

    render(
      <PublicOnlyPage>
        <div>Page Content</div>
      </PublicOnlyPage>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText("Page Content")).not.toBeInTheDocument();
  });

  it("should render children for unauthenticated users", () => {
    mockUseAuthRedirect.mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
      user: null,
    });

    render(
      <PublicOnlyPage>
        <div>Page Content</div>
      </PublicOnlyPage>
    );

    expect(screen.getByText("Page Content")).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it("should use custom loading component when provided", () => {
    mockUseAuthRedirect.mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
      user: undefined,
    });

    render(
      <PublicOnlyPage loadingComponent={<div>Please wait...</div>}>
        <div>Page Content</div>
      </PublicOnlyPage>
    );

    expect(screen.getByText("Please wait...")).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it("should call useAuthRedirect with correct config", () => {
    mockUseAuthRedirect.mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
      user: null,
    });

    render(
      <PublicOnlyPage>
        <div>Page Content</div>
      </PublicOnlyPage>
    );

    expect(mockUseAuthRedirect).toHaveBeenCalledWith({
      ifAuthenticated: "/dashboard",
    });
  });
});

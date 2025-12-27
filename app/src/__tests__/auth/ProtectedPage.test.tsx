/**
 * Tests for ProtectedPage component
 *
 * Test Coverage:
 * - Shows loading state while auth is undefined
 * - Redirects unauthenticated users to /
 * - Shows children for authenticated users
 * - Supports custom loading component
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProtectedPage } from "@/components/auth/ProtectedPage";

// Mock useAuthRedirect hook
vi.mock("@/hooks/useAuthRedirect", () => ({
  useAuthRedirect: vi.fn(),
}));

// Import mocked module
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

describe("ProtectedPage", () => {
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
      <ProtectedPage>
        <div>Dashboard Content</div>
      </ProtectedPage>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText("Dashboard Content")).not.toBeInTheDocument();
  });

  it("should show loading state when unauthenticated (during redirect)", () => {
    mockUseAuthRedirect.mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
      user: null,
    });

    render(
      <ProtectedPage>
        <div>Dashboard Content</div>
      </ProtectedPage>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText("Dashboard Content")).not.toBeInTheDocument();
  });

  it("should render children for authenticated users", () => {
    mockUseAuthRedirect.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { _id: "user123", email: "test@example.com" },
    });

    render(
      <ProtectedPage>
        <div>Dashboard Content</div>
      </ProtectedPage>
    );

    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it("should use custom loading component when provided", () => {
    mockUseAuthRedirect.mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
      user: undefined,
    });

    render(
      <ProtectedPage loadingComponent={<div>Authenticating...</div>}>
        <div>Dashboard Content</div>
      </ProtectedPage>
    );

    expect(screen.getByText("Authenticating...")).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it("should call useAuthRedirect with correct config", () => {
    mockUseAuthRedirect.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { _id: "user123", email: "test@example.com" },
    });

    render(
      <ProtectedPage>
        <div>Dashboard Content</div>
      </ProtectedPage>
    );

    expect(mockUseAuthRedirect).toHaveBeenCalledWith({
      ifUnauthenticated: "/",
    });
  });
});

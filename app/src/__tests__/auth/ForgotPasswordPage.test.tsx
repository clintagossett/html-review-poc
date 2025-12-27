import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useRouter } from "next/navigation";
import ForgotPasswordPage from "@/app/forgot-password/page";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: () => "/forgot-password",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock useAuthRedirect hook
vi.mock("@/hooks/useAuthRedirect", () => ({
  useAuthRedirect: vi.fn(() => ({
    isLoading: false,
    isAuthenticated: false,
  })),
}));

// Mock ForgotPasswordForm component
vi.mock("@/components/auth/ForgotPasswordForm", () => ({
  ForgotPasswordForm: () => <div data-testid="forgot-password-form">Forgot Password Form</div>,
}));

describe("ForgotPasswordPage", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      refresh: vi.fn(),
    });
  });

  it("should render correctly", () => {
    render(<ForgotPasswordPage />);

    expect(screen.getByTestId("forgot-password-form")).toBeInTheDocument();
  });

  it("should have back button that links to login", () => {
    render(<ForgotPasswordPage />);

    const backLink = screen.getByRole("link", { name: /back to login/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/login");
  });

  it("should have gradient background", () => {
    const { container } = render(<ForgotPasswordPage />);

    const bgDiv = container.querySelector(".bg-gradient-to-br");
    expect(bgDiv).toBeInTheDocument();
    expect(bgDiv).toHaveClass("from-blue-50", "via-white", "to-purple-50");
  });

  it("should render ForgotPasswordForm component", () => {
    render(<ForgotPasswordPage />);

    expect(screen.getByTestId("forgot-password-form")).toBeInTheDocument();
  });

  it("should be wrapped in PublicOnlyPage component", async () => {
    // Import the mocked module
    const { useAuthRedirect } = await import("@/hooks/useAuthRedirect");

    // Simulate authenticated user
    (useAuthRedirect as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      isLoading: false,
      isAuthenticated: true,
    });

    render(<ForgotPasswordPage />);

    // PublicOnlyPage should show spinner when authenticated
    // The form should not be visible
    expect(screen.queryByTestId("forgot-password-form")).not.toBeInTheDocument();
  });
});

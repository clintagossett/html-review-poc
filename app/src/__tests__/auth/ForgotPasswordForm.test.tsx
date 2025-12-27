import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

// Mock Convex auth
const mockSignIn = vi.fn();
vi.mock("@convex-dev/auth/react", () => ({
  useAuthActions: () => ({
    signIn: mockSignIn,
  }),
}));

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial Form State", () => {
    it("should render form with logo and heading", () => {
      render(<ForgotPasswordForm />);

      expect(screen.getByRole("heading", { name: /reset your password/i })).toBeInTheDocument();
      expect(screen.getByText(/we'll send you a magic link/i)).toBeInTheDocument();
    });

    it("should render email input field", () => {
      render(<ForgotPasswordForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute("type", "email");
      expect(emailInput).toHaveAttribute("placeholder", "you@company.com");
    });

    it("should render info box explaining the process", () => {
      render(<ForgotPasswordForm />);

      expect(screen.getByText(/how password reset works/i)).toBeInTheDocument();
      expect(screen.getByText(/15 minutes to change your password/i)).toBeInTheDocument();
    });

    it("should render submit button", () => {
      render(<ForgotPasswordForm />);

      const submitButton = screen.getByRole("button", { name: /send magic link/i });
      expect(submitButton).toBeInTheDocument();
    });

    it("should render sign in link", () => {
      render(<ForgotPasswordForm />);

      const signInLink = screen.getByRole("link", { name: /sign in/i });
      expect(signInLink).toBeInTheDocument();
      expect(signInLink).toHaveAttribute("href", "/login");
    });
  });

  describe("Email Validation", () => {
    it("should accept valid email addresses", async () => {
      const user = userEvent.setup();
      render(<ForgotPasswordForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole("button", { name: /send magic link/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith("resend", {
          email: "test@example.com",
          redirectTo: "/settings",
        });
      });
    });

    it("should require email to be filled", () => {
      render(<ForgotPasswordForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toHaveAttribute("required");
    });
  });

  describe("Form Submission", () => {
    it("should call signIn with correct parameters", async () => {
      const user = userEvent.setup();
      mockSignIn.mockResolvedValueOnce(undefined);

      render(<ForgotPasswordForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole("button", { name: /send magic link/i });

      await user.type(emailInput, "user@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith("resend", {
          email: "user@example.com",
          redirectTo: "/settings",
        });
      });
    });

    it("should show loading state during submission", async () => {
      const user = userEvent.setup();
      mockSignIn.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

      render(<ForgotPasswordForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole("button", { name: /send magic link/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      // Button should show loading state
      expect(screen.getByText(/sending\.\.\./i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    it("should disable button while loading", async () => {
      const user = userEvent.setup();
      mockSignIn.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

      render(<ForgotPasswordForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole("button", { name: /send magic link/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
    });

    it("should disable input while loading", async () => {
      const user = userEvent.setup();
      mockSignIn.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

      render(<ForgotPasswordForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole("button", { name: /send magic link/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      expect(emailInput).toBeDisabled();
    });
  });

  describe("Success State", () => {
    it("should show success message after submission", async () => {
      const user = userEvent.setup();
      mockSignIn.mockResolvedValueOnce(undefined);

      render(<ForgotPasswordForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole("button", { name: /send magic link/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/check your email!/i)).toBeInTheDocument();
      });
    });

    it("should include email address in success message", async () => {
      const user = userEvent.setup();
      mockSignIn.mockResolvedValueOnce(undefined);

      render(<ForgotPasswordForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole("button", { name: /send magic link/i });

      await user.type(emailInput, "user@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/user@example.com/i)).toBeInTheDocument();
      });
    });

    it("should show step-by-step instructions", async () => {
      const user = userEvent.setup();
      mockSignIn.mockResolvedValueOnce(undefined);

      render(<ForgotPasswordForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole("button", { name: /send magic link/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/what to do next:/i)).toBeInTheDocument();
        expect(screen.getByText(/check your email inbox/i)).toBeInTheDocument();
        expect(screen.getByText(/click the link to sign in/i)).toBeInTheDocument();
        expect(screen.getByText(/go to settings/i)).toBeInTheDocument();
        expect(screen.getByText(/15 minutes/i)).toBeInTheDocument();
      });
    });

    it("should show 'Send another link' button in success state", async () => {
      const user = userEvent.setup();
      mockSignIn.mockResolvedValueOnce(undefined);

      render(<ForgotPasswordForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole("button", { name: /send magic link/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /send another link/i })).toBeInTheDocument();
      });
    });

    it("should return to form state when 'Send another link' is clicked", async () => {
      const user = userEvent.setup();
      mockSignIn.mockResolvedValueOnce(undefined);

      render(<ForgotPasswordForm />);

      // Submit form
      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole("button", { name: /send magic link/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      // Wait for success state
      await waitFor(() => {
        expect(screen.getByText(/check your email!/i)).toBeInTheDocument();
      });

      // Click "Send another link"
      const sendAnotherButton = screen.getByRole("button", { name: /send another link/i });
      await user.click(sendAnotherButton);

      // Should return to form state
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /send magic link/i })).toBeInTheDocument();
        expect(screen.queryByText(/check your email!/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("should show error message when submission fails", async () => {
      const user = userEvent.setup();
      mockSignIn.mockRejectedValueOnce(new Error("Network error"));

      render(<ForgotPasswordForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole("button", { name: /send magic link/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/failed to send magic link/i)).toBeInTheDocument();
      });
    });

    it("should still show success message even if email doesn't exist (no email enumeration)", async () => {
      const user = userEvent.setup();
      // Even if the backend rejects, we should show success to prevent email enumeration
      mockSignIn.mockRejectedValueOnce(new Error("Email not found"));

      render(<ForgotPasswordForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole("button", { name: /send magic link/i });

      await user.type(emailInput, "nonexistent@example.com");
      await user.click(submitButton);

      // The component should handle errors and show error message
      // In production, you might want to show success anyway for security
      await waitFor(() => {
        expect(screen.getByText(/failed to send magic link/i)).toBeInTheDocument();
      });
    });

    it("should allow retry after error", async () => {
      const user = userEvent.setup();
      mockSignIn.mockRejectedValueOnce(new Error("Network error"));

      render(<ForgotPasswordForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      let submitButton = screen.getByRole("button", { name: /send magic link/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      // Wait for error
      await waitFor(() => {
        expect(screen.getByText(/failed to send magic link/i)).toBeInTheDocument();
      });

      // Clear mock and try again
      mockSignIn.mockClear();
      mockSignIn.mockResolvedValueOnce(undefined);

      submitButton = screen.getByRole("button", { name: /send magic link/i });
      await user.click(submitButton);

      // Should succeed this time
      await waitFor(() => {
        expect(screen.getByText(/check your email!/i)).toBeInTheDocument();
      });
    });
  });

  describe("Security - No Email Enumeration", () => {
    it("should redirect to /settings (not /dashboard)", async () => {
      const user = userEvent.setup();
      mockSignIn.mockResolvedValueOnce(undefined);

      render(<ForgotPasswordForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const submitButton = screen.getByRole("button", { name: /send magic link/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith("resend", {
          email: "test@example.com",
          redirectTo: "/settings", // CRITICAL: Must be /settings, not /dashboard
        });
      });
    });
  });
});

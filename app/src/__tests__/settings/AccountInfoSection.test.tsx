import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccountInfoSection } from "@/components/settings/AccountInfoSection";

// Mock Convex
vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(() => vi.fn()),
}));

// Mock toast
vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

import { useQuery } from "convex/react";

describe("AccountInfoSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display email as read-only", () => {
    vi.mocked(useQuery).mockReturnValue({
      _id: "user123",
      _creationTime: Date.now(),
      email: "test@example.com",
      name: "Test User",
    });

    render(<AccountInfoSection />);

    const emailInput = screen.getByDisplayValue("test@example.com");
    expect(emailInput).toBeDisabled();
  });

  it("should display name in view mode initially", () => {
    vi.mocked(useQuery).mockReturnValue({
      _id: "user123",
      _creationTime: Date.now(),
      email: "test@example.com",
      name: "Test User",
    });

    render(<AccountInfoSection />);

    expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("should enable name editing when Edit clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(useQuery).mockReturnValue({
      _id: "user123",
      _creationTime: Date.now(),
      email: "test@example.com",
      name: "Test User",
    });

    render(<AccountInfoSection />);

    const editButton = screen.getByRole("button", { name: /edit/i });
    await user.click(editButton);

    // Should show Save and Cancel buttons
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /edit/i })).not.toBeInTheDocument();
  });

  it("should allow name to be changed", async () => {
    const user = userEvent.setup();
    vi.mocked(useQuery).mockReturnValue({
      _id: "user123",
      _creationTime: Date.now(),
      email: "test@example.com",
      name: "Test User",
    });

    render(<AccountInfoSection />);

    // Enter edit mode
    await user.click(screen.getByRole("button", { name: /edit/i }));

    // Change name
    const nameInput = screen.getByDisplayValue("Test User");
    await user.clear(nameInput);
    await user.type(nameInput, "New Name");

    expect(screen.getByDisplayValue("New Name")).toBeInTheDocument();
  });

  it("should cancel changes when Cancel clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(useQuery).mockReturnValue({
      _id: "user123",
      _creationTime: Date.now(),
      email: "test@example.com",
      name: "Test User",
    });

    render(<AccountInfoSection />);

    // Enter edit mode
    await user.click(screen.getByRole("button", { name: /edit/i }));

    // Change name
    const nameInput = screen.getByDisplayValue("Test User");
    await user.clear(nameInput);
    await user.type(nameInput, "New Name");

    // Cancel
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    // Should be back in view mode with original name
    expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("should show error for empty name", async () => {
    const user = userEvent.setup();
    vi.mocked(useQuery).mockReturnValue({
      _id: "user123",
      _creationTime: Date.now(),
      email: "test@example.com",
      name: "Test User",
    });

    render(<AccountInfoSection />);

    // Enter edit mode
    await user.click(screen.getByRole("button", { name: /edit/i }));

    // Clear name
    const nameInput = screen.getByDisplayValue("Test User");
    await user.clear(nameInput);

    // Try to save
    await user.click(screen.getByRole("button", { name: /save/i }));

    // Should show error
    await waitFor(() => {
      expect(screen.getByText(/name cannot be empty/i)).toBeInTheDocument();
    });
  });

  it("should show loading state while user data loads", () => {
    vi.mocked(useQuery).mockReturnValue(undefined);

    render(<AccountInfoSection />);

    // Should show some loading indicator
    expect(screen.queryByDisplayValue(/test@example.com/i)).not.toBeInTheDocument();
  });
});

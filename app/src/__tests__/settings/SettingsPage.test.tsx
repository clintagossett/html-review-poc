import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SettingsPage from "@/app/settings/page";

// Mock all child components
vi.mock("@/components/auth/ProtectedPage", () => ({
  ProtectedPage: ({ children }: { children: React.ReactNode }) => <div data-testid="protected-page">{children}</div>,
}));

vi.mock("@/components/settings/AccountInfoSection", () => ({
  AccountInfoSection: () => <div data-testid="account-info-section">Account Info</div>,
}));

vi.mock("@/components/settings/PasswordSection", () => ({
  PasswordSection: () => <div data-testid="password-section">Password Section</div>,
}));

vi.mock("@/components/settings/DebugToggle", () => ({
  DebugToggle: ({ onOverride }: any) => (
    <div data-testid="debug-toggle">
      <button onClick={() => onOverride("auto")}>Auto</button>
      <button onClick={() => onOverride("fresh")}>Fresh</button>
      <button onClick={() => onOverride("stale")}>Stale</button>
    </div>
  ),
}));

describe("SettingsPage", () => {
  it("should render inside ProtectedPage", () => {
    render(<SettingsPage />);

    expect(screen.getByTestId("protected-page")).toBeInTheDocument();
  });

  it("should have back button to dashboard", () => {
    render(<SettingsPage />);

    const backButton = screen.getByRole("button", { name: /back to dashboard/i });
    expect(backButton).toBeInTheDocument();
  });

  it("should have Settings title", () => {
    render(<SettingsPage />);

    expect(screen.getByRole("heading", { name: /^settings$/i })).toBeInTheDocument();
  });

  it("should have description text", () => {
    render(<SettingsPage />);

    expect(screen.getByText(/manage your account settings/i)).toBeInTheDocument();
  });

  it("should render AccountInfoSection", () => {
    render(<SettingsPage />);

    expect(screen.getByTestId("account-info-section")).toBeInTheDocument();
  });

  it("should render PasswordSection", () => {
    render(<SettingsPage />);

    expect(screen.getByTestId("password-section")).toBeInTheDocument();
  });

  it("should render DebugToggle in development mode", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    render(<SettingsPage />);

    // DebugToggle should be rendered
    expect(screen.getByTestId("debug-toggle")).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it("should not render DebugToggle in production mode", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    render(<SettingsPage />);

    // DebugToggle should NOT be rendered
    expect(screen.queryByTestId("debug-toggle")).not.toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });
});

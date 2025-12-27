import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DemoCredentialsPanel } from "@/components/auth/DemoCredentialsPanel";

describe("DemoCredentialsPanel", () => {
  it("should render with default demo credentials", () => {
    render(<DemoCredentialsPanel />);

    expect(screen.getByText("Demo Account")).toBeInTheDocument();
  });

  it("should display email when provided", () => {
    render(<DemoCredentialsPanel email="test@example.com" />);

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("should display password when provided", () => {
    render(<DemoCredentialsPanel password="password123" />);

    expect(screen.getByText("password123")).toBeInTheDocument();
  });

  it("should display both email and password when provided", () => {
    render(
      <DemoCredentialsPanel
        email="demo@test.com"
        password="testpass"
      />
    );

    expect(screen.getByText("demo@test.com")).toBeInTheDocument();
    expect(screen.getByText("testpass")).toBeInTheDocument();
  });

  it("should have cream/yellow background styling", () => {
    const { container } = render(<DemoCredentialsPanel />);

    const panel = container.firstChild as HTMLElement;
    // Should have yellow-100 background (#FEF9C3)
    expect(panel).toHaveClass("bg-yellow-100");
  });

  it("should have rounded corners", () => {
    const { container } = render(<DemoCredentialsPanel />);

    const panel = container.firstChild as HTMLElement;
    expect(panel).toHaveClass("rounded-lg");
  });

  it("should display wand emoji or icon", () => {
    render(<DemoCredentialsPanel />);

    // Check for wand emoji using aria-label
    const wandIcon = screen.getByRole("img", { name: /magic wand/i });
    expect(wandIcon).toBeInTheDocument();
    expect(wandIcon.textContent).toContain("🪄");
  });

  it("should use monospace font for credentials", () => {
    render(
      <DemoCredentialsPanel
        email="test@example.com"
        password="password123"
      />
    );

    const emailElement = screen.getByText("test@example.com");
    const passwordElement = screen.getByText("password123");

    // Credentials should use monospace font
    expect(emailElement).toHaveClass("font-mono");
    expect(passwordElement).toHaveClass("font-mono");
  });

  it("should accept custom className", () => {
    const { container } = render(
      <DemoCredentialsPanel className="custom-class" />
    );

    const panel = container.firstChild as HTMLElement;
    expect(panel).toHaveClass("custom-class");
  });

  it("should display helpful message about demo mode", () => {
    render(<DemoCredentialsPanel />);

    // Should have some text explaining it's for demo/testing
    expect(screen.getByText(/Try out the app with this demo account/i)).toBeInTheDocument();
  });
});

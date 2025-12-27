/**
 * Tests for FullPageSpinner component
 *
 * Test Coverage:
 * - Renders a spinner element
 * - Displays loading text
 * - Has full page styling (centered, full height)
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FullPageSpinner } from "@/components/auth/FullPageSpinner";

describe("FullPageSpinner", () => {
  it("should render loading text", () => {
    render(<FullPageSpinner />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should have centered container styling", () => {
    const { container } = render(<FullPageSpinner />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveClass("flex");
    expect(wrapper).toHaveClass("items-center");
    expect(wrapper).toHaveClass("justify-center");
  });

  it("should have full screen height", () => {
    const { container } = render(<FullPageSpinner />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveClass("min-h-screen");
  });

  it("should render with custom message when provided", () => {
    render(<FullPageSpinner message="Authenticating..." />);
    expect(screen.getByText("Authenticating...")).toBeInTheDocument();
  });
});

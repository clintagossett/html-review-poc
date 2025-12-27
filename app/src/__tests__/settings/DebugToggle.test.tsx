import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DebugToggle } from "@/components/settings/DebugToggle";

describe("DebugToggle", () => {
  let onOverrideMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onOverrideMock = vi.fn();
  });

  it("should render three buttons", () => {
    render(<DebugToggle onOverride={onOverrideMock} />);

    expect(screen.getByRole("button", { name: /auto/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /fresh/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /stale/i })).toBeInTheDocument();
  });

  it("should show debug mode label", () => {
    render(<DebugToggle onOverride={onOverrideMock} />);

    expect(screen.getByText(/debug mode/i)).toBeInTheDocument();
  });

  it("should call onOverride with 'auto' when Auto clicked", async () => {
    const user = userEvent.setup();
    render(<DebugToggle onOverride={onOverrideMock} />);

    const autoButton = screen.getByRole("button", { name: /auto/i });
    await user.click(autoButton);

    expect(onOverrideMock).toHaveBeenCalledWith("auto");
  });

  it("should call onOverride with 'fresh' when Fresh clicked", async () => {
    const user = userEvent.setup();
    render(<DebugToggle onOverride={onOverrideMock} />);

    const freshButton = screen.getByRole("button", { name: /fresh/i });
    await user.click(freshButton);

    expect(onOverrideMock).toHaveBeenCalledWith("fresh");
  });

  it("should call onOverride with 'stale' when Stale clicked", async () => {
    const user = userEvent.setup();
    render(<DebugToggle onOverride={onOverrideMock} />);

    const staleButton = screen.getByRole("button", { name: /stale/i });
    await user.click(staleButton);

    expect(onOverrideMock).toHaveBeenCalledWith("stale");
  });

  it("should have purple styling", () => {
    const { container } = render(<DebugToggle onOverride={onOverrideMock} />);

    const banner = container.querySelector('.bg-purple-50');
    expect(banner).toBeInTheDocument();
  });
});

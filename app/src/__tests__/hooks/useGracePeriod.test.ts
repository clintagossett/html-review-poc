import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useGracePeriod, formatTimeRemaining } from "@/hooks/useGracePeriod";

// Mock Convex
vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
}));

import { useQuery } from "convex/react";

describe("useGracePeriod", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("should return loading state initially", () => {
    // Mock query returning undefined (loading state)
    vi.mocked(useQuery).mockReturnValue(undefined);

    const { result } = renderHook(() => useGracePeriod());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isWithinGracePeriod).toBe(false);
    expect(result.current.timeRemaining).toBe(0);
  });

  it("should return grace period status from API", () => {
    const now = Date.now();
    const expiresAt = now + 15 * 60 * 1000; // 15 minutes from now

    // Mock query returning grace period status
    vi.mocked(useQuery).mockReturnValue({
      isWithinGracePeriod: true,
      expiresAt,
      sessionCreatedAt: now,
    });

    const { result } = renderHook(() => useGracePeriod());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isWithinGracePeriod).toBe(true);
    expect(result.current.expiresAt).toBe(expiresAt);
    expect(result.current.timeRemaining).toBeGreaterThan(0);
  });

  it("should calculate time remaining correctly", () => {
    const now = Date.now();
    const expiresAt = now + 10 * 1000; // 10 seconds from now

    vi.mocked(useQuery).mockReturnValue({
      isWithinGracePeriod: true,
      expiresAt,
      sessionCreatedAt: now,
    });

    const { result } = renderHook(() => useGracePeriod());

    expect(result.current.timeRemaining).toBeGreaterThan(9000);
    expect(result.current.timeRemaining).toBeLessThanOrEqual(10000);
  });

  it("should return zero when expiry time has passed", () => {
    const now = Date.now();
    const expiresAt = now - 1000; // 1 second in the past

    vi.mocked(useQuery).mockReturnValue({
      isWithinGracePeriod: false,
      expiresAt,
      sessionCreatedAt: now - 16 * 60 * 1000,
    });

    const { result } = renderHook(() => useGracePeriod());

    expect(result.current.timeRemaining).toBe(0);
  });

  it("should return zero time when grace period already expired", () => {
    // Mock query returning expired state
    vi.mocked(useQuery).mockReturnValue({
      isWithinGracePeriod: false,
      expiresAt: null,
      sessionCreatedAt: Date.now() - 20 * 60 * 1000,
    });

    const { result } = renderHook(() => useGracePeriod());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isWithinGracePeriod).toBe(false);
    expect(result.current.timeRemaining).toBe(0);
  });
});

describe("formatTimeRemaining", () => {
  it("should format minutes and seconds correctly", () => {
    expect(formatTimeRemaining(5 * 60 * 1000 + 30 * 1000)).toBe("5 minutes 30 seconds");
  });

  it("should handle singular minute", () => {
    expect(formatTimeRemaining(1 * 60 * 1000 + 30 * 1000)).toBe("1 minute 30 seconds");
  });

  it("should handle singular second", () => {
    expect(formatTimeRemaining(2 * 60 * 1000 + 1 * 1000)).toBe("2 minutes 1 second");
  });

  it("should format seconds only when less than 1 minute", () => {
    expect(formatTimeRemaining(45 * 1000)).toBe("45 seconds");
  });

  it("should handle singular second when less than 1 minute", () => {
    expect(formatTimeRemaining(1 * 1000)).toBe("1 second");
  });

  it("should handle zero", () => {
    expect(formatTimeRemaining(0)).toBe("0 seconds");
  });
});

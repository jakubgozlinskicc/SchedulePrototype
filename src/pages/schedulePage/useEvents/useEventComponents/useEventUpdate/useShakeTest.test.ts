import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useShake } from "./useShake";

describe("useShake", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("It should initialize with isShaking false", () => {
    const { result } = renderHook(() => useShake());

    expect(result.current.isShaking).toBe(false);
  });

  it("It should set isShaking to true when triggerShake is called", () => {
    const { result } = renderHook(() => useShake());

    act(() => {
      result.current.triggerShake();
    });

    expect(result.current.isShaking).toBe(true);
  });

  it("It should reset isShaking to false after duration", () => {
    const { result } = renderHook(() => useShake(300));

    act(() => {
      result.current.triggerShake();
    });

    expect(result.current.isShaking).toBe(true);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.isShaking).toBe(false);
  });

  it("It should clear previous timeout when triggerShake is called again", () => {
    const clearSpy = vi.spyOn(window, "clearTimeout");

    const { result } = renderHook(() => useShake(300));

    act(() => {
      result.current.triggerShake();
    });

    act(() => {
      result.current.triggerShake();
    });

    expect(clearSpy).toHaveBeenCalled();
  });
});

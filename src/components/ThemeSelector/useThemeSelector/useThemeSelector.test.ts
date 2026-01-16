import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { THEMES, DEFAULT_THEME, STORAGE_KEY } from "../ThemeSelector.types";
import { useThemeSelector } from "./useThemeSeletor";

describe("useThemeSelector", () => {
  let mockLocalStorage: Record<string, string>;

  beforeEach(() => {
    vi.useFakeTimers();
    mockLocalStorage = {};

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
      },
      writable: true,
    });

    document.documentElement.style.setProperty = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("should return default theme when localStorage is empty", () => {
    const { result } = renderHook(() => useThemeSelector());
    expect(result.current.currentTheme).toBe(DEFAULT_THEME);
  });

  it("should return saved theme from localStorage", () => {
    mockLocalStorage[STORAGE_KEY] = "violet";
    const { result } = renderHook(() => useThemeSelector());
    expect(result.current.currentTheme).toBe("violet");
  });

  it("should return default theme when saved theme is invalid", () => {
    mockLocalStorage[STORAGE_KEY] = "invalid-theme";
    const { result } = renderHook(() => useThemeSelector());
    expect(result.current.currentTheme).toBe(DEFAULT_THEME);
  });

  it("should initialize state correctly", () => {
    const { result } = renderHook(() => useThemeSelector());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.loaderTrigger).toBe(0);
    expect(result.current.loaderColor).toBe("");
    expect(result.current.themes).toEqual(THEMES);
  });

  it("should apply theme CSS variables on mount", () => {
    mockLocalStorage[STORAGE_KEY] = "blue";
    renderHook(() => useThemeSelector());

    expect(document.documentElement.style.setProperty).toHaveBeenCalledWith(
      "--color-primary",
      THEMES.blue.primary
    );
    expect(document.documentElement.style.setProperty).toHaveBeenCalledWith(
      "--color-primary-hover",
      THEMES.blue.primaryHover
    );
    expect(document.documentElement.style.setProperty).toHaveBeenCalledWith(
      "--color-primary-transparent",
      THEMES.blue.primaryTransparent
    );
  });

  it("should set loader state and close dropdown immediately", () => {
    const { result } = renderHook(() => useThemeSelector());

    act(() => {
      result.current.setIsOpen(true);
      result.current.changeTheme("green");
    });

    expect(result.current.loaderColor).toBe(THEMES.green.primaryTransparent);
    expect(result.current.loaderTrigger).toBe(1);
    expect(result.current.isOpen).toBe(false);
  });

  it("should change theme and save to localStorage after timeout", () => {
    const { result } = renderHook(() => useThemeSelector());

    act(() => {
      result.current.changeTheme("orange");
    });

    expect(result.current.currentTheme).toBe(DEFAULT_THEME);
    expect(localStorage.setItem).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current.currentTheme).toBe("orange");
    expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, "orange");
  });

  it("should apply CSS variables after timeout", () => {
    const { result } = renderHook(() => useThemeSelector());
    vi.mocked(document.documentElement.style.setProperty).mockClear();

    act(() => {
      result.current.changeTheme("cyan");
      vi.advanceTimersByTime(400);
    });

    expect(document.documentElement.style.setProperty).toHaveBeenCalledWith(
      "--color-primary",
      THEMES.cyan.primary
    );
  });

  it("should handle invalid theme", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const { result } = renderHook(() => useThemeSelector());
    const initialTheme = result.current.currentTheme;

    act(() => {
      result.current.changeTheme("invalid-theme");
      vi.advanceTimersByTime(400);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Theme "invalid-theme" does not exist'
    );
    expect(result.current.currentTheme).toBe(initialTheme);
    expect(localStorage.setItem).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it("should cancel previous timeout when changing rapidly", () => {
    const { result } = renderHook(() => useThemeSelector());

    act(() => {
      result.current.changeTheme("green");
      vi.advanceTimersByTime(200);
      result.current.changeTheme("blue");
      vi.advanceTimersByTime(400);
    });

    expect(result.current.currentTheme).toBe("blue");
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });
});

it("should clear timeout on unmount", () => {
  const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
  const { result, unmount } = renderHook(() => useThemeSelector());

  act(() => {
    result.current.changeTheme("green");
  });

  unmount();
  expect(clearTimeoutSpy).toHaveBeenCalled();
});

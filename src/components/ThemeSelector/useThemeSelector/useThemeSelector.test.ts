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
    document.documentElement.classList.add = vi.fn();
    document.documentElement.classList.remove = vi.fn();
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

  it("should change theme immediately and save to localStorage", () => {
    const { result } = renderHook(() => useThemeSelector());
    vi.mocked(document.documentElement.style.setProperty).mockClear();

    act(() => {
      result.current.changeTheme("cyan");
    });

    expect(result.current.currentTheme).toBe("cyan");
    expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, "cyan");
    expect(document.documentElement.style.setProperty).toHaveBeenCalledWith(
      "--color-primary",
      THEMES.cyan.primary
    );
  });

  it("should enable global transition when changing theme", () => {
    const { result } = renderHook(() => useThemeSelector());

    act(() => {
      result.current.changeTheme("cyan");
    });

    expect(document.documentElement.classList.add).toHaveBeenCalledWith(
      "theme-transitioning"
    );
  });

  it("should remove transition class after duration", () => {
    const { result } = renderHook(() => useThemeSelector());

    act(() => {
      result.current.changeTheme("cyan");
    });

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
      "theme-transitioning"
    );
  });

  it("should not change theme when selecting same theme", () => {
    const { result } = renderHook(() => useThemeSelector());
    const initialTheme = result.current.currentTheme;

    act(() => {
      result.current.changeTheme(initialTheme);
    });

    expect(localStorage.setItem).not.toHaveBeenCalled();
    expect(document.documentElement.classList.add).not.toHaveBeenCalledWith(
      "theme-transitioning"
    );
  });

  it("should not change theme when theme is invalid", () => {
    const { result } = renderHook(() => useThemeSelector());
    const initialTheme = result.current.currentTheme;

    act(() => {
      result.current.changeTheme("invalid-theme");
    });

    expect(result.current.currentTheme).toBe(initialTheme);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it("should close dropdown when changing theme", () => {
    const { result } = renderHook(() => useThemeSelector());

    act(() => {
      result.current.toggleOpen();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.changeTheme("blue");
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("should toggle dropdown open state", () => {
    const { result } = renderHook(() => useThemeSelector());

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.toggleOpen();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggleOpen();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("should remove transition class on unmount", () => {
    const { unmount } = renderHook(() => useThemeSelector());

    unmount();

    expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
      "theme-transitioning"
    );
  });
});

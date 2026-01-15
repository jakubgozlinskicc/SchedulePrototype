import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { THEMES, DEFAULT_THEME, STORAGE_KEY } from "../ThemeSelector.types";
import { useThemeSelector } from "./useThemeSeletor";

describe("useThemeSelector", () => {
  let originalLocalStorage: Storage;
  let mockLocalStorage: Record<string, string>;

  beforeEach(() => {
    mockLocalStorage = {};

    originalLocalStorage = window.localStorage;

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete mockLocalStorage[key];
        }),
        clear: vi.fn(() => {
          mockLocalStorage = {};
        }),
      },
      writable: true,
    });

    document.documentElement.style.setProperty = vi.fn();
  });

  afterEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: originalLocalStorage,
      writable: true,
    });
    vi.clearAllMocks();
  });

  describe("initialization", () => {
    it("should return default theme when no saved theme exists", () => {
      const { result } = renderHook(() => useThemeSelector());

      expect(result.current.currentTheme).toBe(DEFAULT_THEME);
    });

    it("should return saved theme from localStorage", () => {
      mockLocalStorage[STORAGE_KEY] = "violet";

      const { result } = renderHook(() => useThemeSelector());

      expect(result.current.currentTheme).toBe("violet");
    });

    it("should return default theme when saved theme is invalid", () => {
      mockLocalStorage[STORAGE_KEY] = "nonexistent-theme";

      const { result } = renderHook(() => useThemeSelector());

      expect(result.current.currentTheme).toBe(DEFAULT_THEME);
    });

    it("should return all themes", () => {
      const { result } = renderHook(() => useThemeSelector());

      expect(result.current.themes).toEqual(THEMES);
    });
  });

  describe("applyTheme on mount", () => {
    it("should apply theme CSS variables on initial render", () => {
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
  });

  describe("changeTheme", () => {
    it("should change current theme", () => {
      const { result } = renderHook(() => useThemeSelector());

      act(() => {
        result.current.changeTheme("green");
      });

      expect(result.current.currentTheme).toBe("green");
    });

    it("should save theme to localStorage", () => {
      const { result } = renderHook(() => useThemeSelector());

      act(() => {
        result.current.changeTheme("orange");
      });

      expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, "orange");
    });

    it("should apply CSS variables when theme changes", () => {
      const { result } = renderHook(() => useThemeSelector());

      act(() => {
        result.current.changeTheme("cyan");
      });

      expect(document.documentElement.style.setProperty).toHaveBeenCalledWith(
        "--color-primary",
        THEMES.cyan.primary
      );
      expect(document.documentElement.style.setProperty).toHaveBeenCalledWith(
        "--color-primary-hover",
        THEMES.cyan.primaryHover
      );
      expect(document.documentElement.style.setProperty).toHaveBeenCalledWith(
        "--color-primary-transparent",
        THEMES.cyan.primaryTransparent
      );
    });

    it("should not change theme when invalid theme key is provided", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const { result } = renderHook(() => useThemeSelector());

      const initialTheme = result.current.currentTheme;

      act(() => {
        result.current.changeTheme("invalid-theme");
      });

      expect(result.current.currentTheme).toBe(initialTheme);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Theme "invalid-theme" does not exist'
      );

      consoleErrorSpy.mockRestore();
    });

    it("should not save invalid theme to localStorage", () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      const { result } = renderHook(() => useThemeSelector());

      const setItemCallsBefore = vi.mocked(localStorage.setItem).mock.calls
        .length;

      act(() => {
        result.current.changeTheme("invalid-theme");
      });

      expect(vi.mocked(localStorage.setItem).mock.calls.length).toBe(
        setItemCallsBefore
      );
    });
  });

  describe("all themes", () => {
    it.each(Object.keys(THEMES))(
      "should apply %s theme correctly",
      (themeKey) => {
        const { result } = renderHook(() => useThemeSelector());

        act(() => {
          result.current.changeTheme(themeKey);
        });

        expect(result.current.currentTheme).toBe(themeKey);
        expect(document.documentElement.style.setProperty).toHaveBeenCalledWith(
          "--color-primary",
          THEMES[themeKey].primary
        );
      }
    );
  });
});

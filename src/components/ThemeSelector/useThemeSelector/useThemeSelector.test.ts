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
    vi.useRealTimers();
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

    it("should initialize loaderTrigger as 0", () => {
      const { result } = renderHook(() => useThemeSelector());

      expect(result.current.loaderTrigger).toBe(0);
    });

    it("should initialize loaderColor as empty string", () => {
      const { result } = renderHook(() => useThemeSelector());

      expect(result.current.loaderColor).toBe("");
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
    it("should set loaderColor immediately", () => {
      const { result } = renderHook(() => useThemeSelector());

      act(() => {
        result.current.changeTheme("green");
      });

      expect(result.current.loaderColor).toBe(THEMES.green.primaryTransparent);
    });

    it("should increment loaderTrigger immediately", () => {
      const { result } = renderHook(() => useThemeSelector());

      act(() => {
        result.current.changeTheme("green");
      });

      expect(result.current.loaderTrigger).toBe(1);
    });

    it("should not change theme before timeout", () => {
      const { result } = renderHook(() => useThemeSelector());
      const initialTheme = result.current.currentTheme;

      act(() => {
        result.current.changeTheme("green");
      });

      expect(result.current.currentTheme).toBe(initialTheme);
    });

    it("should change current theme after timeout", () => {
      const { result } = renderHook(() => useThemeSelector());

      act(() => {
        result.current.changeTheme("green");
      });

      act(() => {
        vi.advanceTimersByTime(400);
      });

      expect(result.current.currentTheme).toBe("green");
    });

    it("should save theme to localStorage after timeout", () => {
      const { result } = renderHook(() => useThemeSelector());

      act(() => {
        result.current.changeTheme("orange");
      });

      expect(localStorage.setItem).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(400);
      });

      expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, "orange");
    });

    it("should apply CSS variables after timeout", () => {
      const { result } = renderHook(() => useThemeSelector());

      vi.mocked(document.documentElement.style.setProperty).mockClear();

      act(() => {
        result.current.changeTheme("cyan");
      });

      expect(document.documentElement.style.setProperty).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(400);
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

      act(() => {
        vi.advanceTimersByTime(400);
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

      act(() => {
        result.current.changeTheme("invalid-theme");
      });

      act(() => {
        vi.advanceTimersByTime(400);
      });

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it("should cancel previous timeout when changing theme rapidly", () => {
      const { result } = renderHook(() => useThemeSelector());

      act(() => {
        result.current.changeTheme("green");
      });

      act(() => {
        vi.advanceTimersByTime(200);
      });

      act(() => {
        result.current.changeTheme("blue");
      });

      act(() => {
        vi.advanceTimersByTime(400);
      });

      expect(result.current.currentTheme).toBe("blue");
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, "blue");
    });

    it("should increment loaderTrigger on each theme change", () => {
      const { result } = renderHook(() => useThemeSelector());

      act(() => {
        result.current.changeTheme("green");
      });

      expect(result.current.loaderTrigger).toBe(1);

      act(() => {
        vi.advanceTimersByTime(400);
      });

      act(() => {
        result.current.changeTheme("blue");
      });

      expect(result.current.loaderTrigger).toBe(2);
    });
  });

  describe("cleanup", () => {
    it("should clear timeout on unmount", () => {
      const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
      const { result, unmount } = renderHook(() => useThemeSelector());

      act(() => {
        result.current.changeTheme("green");
      });

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
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

        act(() => {
          vi.advanceTimersByTime(400);
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

import { useState, useEffect, useRef, useCallback } from "react";
import { DEFAULT_THEME, STORAGE_KEY, THEMES } from "../ThemeSelector.types";
import { useClickOutside } from "../../../hooks/useClickOutside/useClickOutside";

const applyTheme = (themeKey: string): void => {
  const theme = THEMES[themeKey];
  if (!theme) return;

  const root = document.documentElement;
  root.style.setProperty("--color-primary", theme.primary);
  root.style.setProperty("--color-primary-hover", theme.primaryHover);
  root.style.setProperty(
    "--color-primary-transparent",
    theme.primaryTransparent
  );
};

const getInitialTheme = (): string => {
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme && THEMES[savedTheme]) {
    return savedTheme;
  }
  return DEFAULT_THEME;
};

export const useThemeSelector = () => {
  const [currentTheme, setCurrentTheme] = useState<string>(getInitialTheme);
  const [loaderTrigger, setLoaderTrigger] = useState(0);
  const [loaderColor, setLoaderColor] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  useClickOutside(containerRef, closeDropdown);

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const changeTheme = (themeKey: string): void => {
    if (!THEMES[themeKey]) {
      console.error(`Theme "${themeKey}" does not exist`);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLoaderColor(THEMES[themeKey].primaryTransparent);
    setLoaderTrigger((prev) => prev + 1);

    timeoutRef.current = setTimeout(() => {
      setCurrentTheme(themeKey);
      localStorage.setItem(STORAGE_KEY, themeKey);
      setIsOpen(false);
    }, 400);
  };

  return {
    isOpen,
    toggleOpen,
    containerRef,
    currentTheme,
    changeTheme,
    themes: THEMES,
    loaderTrigger,
    loaderColor,
  };
};

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

const TRANSITION_DURATION = 1500;

const enableGlobalTransition = (): void => {
  document.documentElement.classList.add("theme-transitioning");

  setTimeout(() => {
    document.documentElement.classList.remove("theme-transitioning");
  }, TRANSITION_DURATION);
};

export const useThemeSelector = () => {
  const [currentTheme, setCurrentTheme] = useState<string>(getInitialTheme);
  const [isOpen, setIsOpen] = useState(false);
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
      document.documentElement.classList.remove("theme-transitioning");
    };
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const changeTheme = (themeKey: string): void => {
    if (!THEMES[themeKey] || themeKey === currentTheme) return;

    enableGlobalTransition();
    setCurrentTheme(themeKey);
    localStorage.setItem(STORAGE_KEY, themeKey);
    setIsOpen(false);
  };

  return {
    isOpen,
    toggleOpen,
    containerRef,
    currentTheme,
    changeTheme,
    themes: THEMES,
  };
};

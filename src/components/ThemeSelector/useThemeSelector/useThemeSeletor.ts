import { useState, useEffect } from "react";
import { DEFAULT_THEME, STORAGE_KEY, THEMES } from "../ThemeSelector.types";

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

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  const changeTheme = (themeKey: string): void => {
    if (!THEMES[themeKey]) {
      console.error(`Theme "${themeKey}" does not exist`);
      return;
    }

    setCurrentTheme(themeKey);
    applyTheme(themeKey);
    localStorage.setItem(STORAGE_KEY, themeKey);
  };

  return {
    currentTheme,
    changeTheme,
    themes: THEMES,
  };
};

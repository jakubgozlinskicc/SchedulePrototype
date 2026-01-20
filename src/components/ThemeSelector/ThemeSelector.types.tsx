export interface Theme {
  name: string;
  primary: string;
  primaryHover: string;
  primaryTransparent: string;
}

export const THEMES: Record<string, Theme> = {
  violet: {
    name: "violet",
    primary: "#c1bef1",
    primaryHover: "#9791e5",
    primaryTransparent: "rgba(193, 190, 241, 0.5)",
  },
  pink: {
    name: "pink",
    primary: "#f1d5f5",
    primaryHover: "#ecc0f1",
    primaryTransparent: "rgba(241, 213, 245, 0.5)",
  },
  green: {
    name: "green",
    primary: "#a7f3d0",
    primaryHover: "#6ee7b7",
    primaryTransparent: "rgba(167, 243, 208, 0.5)",
  },
  blue: {
    name: "blue",
    primary: "#bfdbfe",
    primaryHover: "#93c5fd",
    primaryTransparent: "rgba(191, 219, 254, 0.5)",
  },
  cyan: {
    name: "cyan",
    primary: "#a5f3fc",
    primaryHover: "#67e8f9",
    primaryTransparent: "rgba(165, 243, 252, 0.5)",
  },
  orange: {
    name: "orange",
    primary: "#fed7aa",
    primaryHover: "#fdba74",
    primaryTransparent: "rgba(254, 215, 170, 0.5)",
  },
  peach: {
    name: "peach",
    primary: "#fecaca",
    primaryHover: "#fca5a5",
    primaryTransparent: "rgba(254, 202, 202, 0.5)",
  },
  silver: {
    name: "silver",
    primary: "#e2e8f0",
    primaryHover: "#cbd5e1",
    primaryTransparent: "rgba(226, 232, 240, 0.5)",
  },
  gold: {
    name: "gold",
    primary: "#fde68a",
    primaryHover: "#facc15",
    primaryTransparent: "rgba(253, 230, 138, 0.5)",
  },
};

export const STORAGE_KEY = "selectedTheme";
export const DEFAULT_THEME = "violet";

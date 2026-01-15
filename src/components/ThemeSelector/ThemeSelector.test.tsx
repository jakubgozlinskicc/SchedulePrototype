import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeSelector } from "./ThemeSelector";
import { THEMES } from "./ThemeSelector.types";

const mockChangeTheme = vi.fn();

vi.mock("./useThemeSelector/useThemeSeletor", () => ({
  useThemeSelector: () => ({
    currentTheme: "pink",
    changeTheme: mockChangeTheme,
    themes: THEMES,
    loaderTrigger: 0,
    loaderColor: "",
  }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../Selector/Selector", () => ({
  Selector: ({
    children,
    currentLanguage,
    onChange,
  }: {
    children: React.ReactNode;
    currentLanguage: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  }) => (
    <select
      data-testid="theme-selector"
      value={currentLanguage}
      onChange={onChange}
    >
      {children}
    </select>
  ),
}));

vi.mock("./ColorLoader/ColorLoader", () => ({
  ColorLoader: ({ color, trigger }: { color: string; trigger: number }) => (
    <div data-testid="color-loader" data-color={color} data-trigger={trigger} />
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ThemeSelector", () => {
  it("should render selector component", () => {
    render(<ThemeSelector />);
    expect(screen.getByTestId("theme-selector")).toBeInTheDocument();
  });

  it("should render ColorLoader component", () => {
    render(<ThemeSelector />);
    expect(screen.getByTestId("color-loader")).toBeInTheDocument();
  });

  it("should render all theme options", () => {
    render(<ThemeSelector />);
    Object.keys(THEMES).forEach((themeKey) => {
      expect(screen.getByText(THEMES[themeKey].name)).toBeInTheDocument();
    });
  });

  it("should render correct number of options", () => {
    render(<ThemeSelector />);
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(Object.keys(THEMES).length);
  });

  it("should have correct current theme selected", () => {
    render(<ThemeSelector />);
    const selector = screen.getByTestId("theme-selector");
    expect(selector).toHaveValue("pink");
  });

  it("should call changeTheme when option is selected", () => {
    render(<ThemeSelector />);
    const selector = screen.getByTestId("theme-selector");
    fireEvent.change(selector, { target: { value: "blue" } });
    expect(mockChangeTheme).toHaveBeenCalledWith("blue");
  });

  it("should call changeTheme with correct value for each theme", () => {
    render(<ThemeSelector />);
    const selector = screen.getByTestId("theme-selector");

    Object.keys(THEMES).forEach((themeKey) => {
      fireEvent.change(selector, { target: { value: themeKey } });
      expect(mockChangeTheme).toHaveBeenCalledWith(themeKey);
    });
  });

  it("should translate theme names using t function", () => {
    render(<ThemeSelector />);
    Object.values(THEMES).forEach((theme) => {
      expect(screen.getByText(theme.name)).toBeInTheDocument();
    });
  });

  it("should pass loaderColor and loaderTrigger to ColorLoader", () => {
    render(<ThemeSelector />);
    const loader = screen.getByTestId("color-loader");
    expect(loader).toHaveAttribute("data-color", "");
    expect(loader).toHaveAttribute("data-trigger", "0");
  });
});

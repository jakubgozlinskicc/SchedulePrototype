import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeSelector } from "./ThemeSelector";
import { THEMES } from "./ThemeSelector.types";

const mockChangeTheme = vi.fn();
const mockToggleOpen = vi.fn();

vi.mock("./useThemeSelector/useThemeSeletor.ts", () => ({
  useThemeSelector: () => ({
    currentTheme: "pink",
    changeTheme: mockChangeTheme,
    toggleOpen: mockToggleOpen,
    themes: THEMES,
    isOpen: false,
  }),
}));

vi.mock("../Button/Button", () => ({
  Button: ({
    children,
    onClick,
    variant,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    variant: string;
  }) => (
    <button
      data-testid="toggle-button"
      data-variant={variant}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ThemeSelector", () => {
  it("should render toggle button with primary variant", () => {
    render(<ThemeSelector />);
    const button = screen.getByTestId("toggle-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-variant", "primary");
  });

  it("should display current theme color in toggle button", () => {
    render(<ThemeSelector />);
    const dot = screen.getByTestId("toggle-button").querySelector("span");
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveStyle({ backgroundColor: THEMES.pink.primaryHover });
  });

  it("should call toggleOpen when toggle button is clicked", () => {
    render(<ThemeSelector />);
    const toggleButton = screen.getByTestId("toggle-button");

    fireEvent.click(toggleButton);
    expect(mockToggleOpen).toHaveBeenCalledTimes(1);
  });

  it("should render theme dropdown container", () => {
    const { container } = render(<ThemeSelector />);
    const dropdown = container.querySelector('[class*="themeDropdown"]');
    expect(dropdown).toBeInTheDocument();
  });

  it("should render all theme option buttons", () => {
    render(<ThemeSelector />);
    const themeButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.getAttribute("type") === "button");
    expect(themeButtons).toHaveLength(Object.keys(THEMES).length);
  });

  it("should call changeTheme with correct key when theme option is clicked", () => {
    render(<ThemeSelector />);
    const themeButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.getAttribute("type") === "button");
    const firstThemeKey = Object.keys(THEMES)[0];

    fireEvent.click(themeButtons[0]);
    expect(mockChangeTheme).toHaveBeenCalledWith(firstThemeKey);
    expect(mockChangeTheme).toHaveBeenCalledTimes(1);
  });

  it("should call changeTheme for each theme option", () => {
    render(<ThemeSelector />);
    const themeButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.getAttribute("type") === "button");

    Object.keys(THEMES).forEach((themeKey, index) => {
      fireEvent.click(themeButtons[index]);
      expect(mockChangeTheme).toHaveBeenCalledWith(themeKey);
    });
  });

  it("should apply selected class to current theme option", () => {
    render(<ThemeSelector />);
    const themeButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.getAttribute("type") === "button");
    const pinkButtonIndex = Object.keys(THEMES).indexOf("pink");

    expect(themeButtons[pinkButtonIndex].className).toContain("selected");
  });

  it("should render theme options container", () => {
    const { container } = render(<ThemeSelector />);
    const optionsContainer = container.querySelector('[class*="themeOptions"]');
    expect(optionsContainer).toBeInTheDocument();
  });
});

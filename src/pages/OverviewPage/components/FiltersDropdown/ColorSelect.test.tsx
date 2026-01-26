import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ColorSelect } from "./ColorSelect";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("ColorSelect", () => {
  const mockOnChange = vi.fn();

  const getToggleButton = () =>
    document.querySelector(".color-select-toggle") as HTMLButtonElement;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render with placeholder when no colors selected", () => {
    render(<ColorSelect selectedColors={[]} onChange={mockOnChange} />);

    expect(screen.getByText("select-colors")).toBeInTheDocument();
  });

  it("should show preview dots when colors are selected", () => {
    render(
      <ColorSelect selectedColors={["red", "blue"]} onChange={mockOnChange} />,
    );

    const previewDots = document.querySelectorAll(".color-preview-dot");
    expect(previewDots.length).toBe(2);
  });

  it("should toggle dropdown when button is clicked", () => {
    render(<ColorSelect selectedColors={[]} onChange={mockOnChange} />);

    const toggleButton = getToggleButton();

    expect(document.querySelector(".color-select-dropdown.open")).toBeNull();

    fireEvent.click(toggleButton);
    expect(
      document.querySelector(".color-select-dropdown.open"),
    ).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(document.querySelector(".color-select-dropdown.open")).toBeNull();
  });

  it("should render all 13 color options plus reset button", () => {
    render(<ColorSelect selectedColors={[]} onChange={mockOnChange} />);

    fireEvent.click(getToggleButton());

    const colorOptions = document.querySelectorAll(".color-option");
    expect(colorOptions.length).toBe(14);
  });

  it("should add color when unselected color is clicked", () => {
    render(<ColorSelect selectedColors={[]} onChange={mockOnChange} />);

    fireEvent.click(getToggleButton());

    const colorOptions = document.querySelectorAll(".color-option");
    fireEvent.click(colorOptions[0]);

    expect(mockOnChange).toHaveBeenCalledWith(["red"]);
  });

  it("should remove color when selected color is clicked", () => {
    render(
      <ColorSelect selectedColors={["red", "blue"]} onChange={mockOnChange} />,
    );

    fireEvent.click(getToggleButton());

    const colorOptions = document.querySelectorAll(".color-option");
    fireEvent.click(colorOptions[0]);

    expect(mockOnChange).toHaveBeenCalledWith(["blue"]);
  });

  it("should not show preview when no colors selected", () => {
    render(<ColorSelect selectedColors={[]} onChange={mockOnChange} />);

    const previewDots = document.querySelectorAll(".color-preview-dot");
    expect(previewDots.length).toBe(0);
  });

  it("should mark selected colors with selected class", () => {
    render(<ColorSelect selectedColors={["red"]} onChange={mockOnChange} />);

    fireEvent.click(getToggleButton());

    const selectedOptions = document.querySelectorAll(".color-option.selected");
    expect(selectedOptions.length).toBe(1);
  });

  it("should rotate arrow when dropdown is open", () => {
    render(<ColorSelect selectedColors={[]} onChange={mockOnChange} />);

    expect(document.querySelector(".color-select-arrow.open")).toBeNull();

    fireEvent.click(getToggleButton());

    expect(
      document.querySelector(".color-select-arrow.open"),
    ).toBeInTheDocument();
  });

  it("should apply correct background color to preview dots", () => {
    render(<ColorSelect selectedColors={["red"]} onChange={mockOnChange} />);

    const previewDot = document.querySelector(
      ".color-preview-dot",
    ) as HTMLElement;
    expect(previewDot.style.backgroundColor).toBe("rgb(255, 0, 0)");
  });

  it("should handle adding multiple colors", () => {
    render(<ColorSelect selectedColors={["red"]} onChange={mockOnChange} />);

    fireEvent.click(getToggleButton());

    const colorOptions = document.querySelectorAll(".color-option");
    fireEvent.click(colorOptions[4]);

    expect(mockOnChange).toHaveBeenCalledWith(["red", "blue"]);
  });

  it("should reset all colors when reset button is clicked", () => {
    render(
      <ColorSelect selectedColors={["red", "blue"]} onChange={mockOnChange} />,
    );

    fireEvent.click(getToggleButton());

    const colorOptions = document.querySelectorAll(".color-option");
    const resetButton = colorOptions[colorOptions.length - 1];
    fireEvent.click(resetButton);

    expect(mockOnChange).toHaveBeenCalledWith([]);
  });
});

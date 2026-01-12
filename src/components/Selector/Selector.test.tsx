import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Selector } from "./Selector";
import styles from "./Selector.module.css";

describe("Selector", () => {
  const defaultProps = {
    currentLanguage: "enUS",
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render select element", () => {
    render(
      <Selector {...defaultProps}>
        <option value="enUS">EN</option>
      </Selector>
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("should render children options", () => {
    render(
      <Selector {...defaultProps}>
        <option value="enUS">EN</option>
        <option value="pl">PL</option>
      </Selector>
    );

    expect(screen.getByRole("option", { name: "EN" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "PL" })).toBeInTheDocument();
  });

  it("should display current language as selected value", () => {
    render(
      <Selector {...defaultProps} currentLanguage="pl">
        <option value="enUS">EN</option>
        <option value="pl">PL</option>
      </Selector>
    );

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("pl");
  });

  it("should apply languageSelector class", () => {
    render(
      <Selector {...defaultProps}>
        <option value="enUS">EN</option>
      </Selector>
    );

    const select = screen.getByRole("combobox");
    expect(select).toHaveClass(styles.languageSelector);
  });

  it("should call onChange when selection changes", () => {
    const handleChange = vi.fn();
    render(
      <Selector {...defaultProps} onChange={handleChange}>
        <option value="enUS">EN</option>
        <option value="pl">PL</option>
      </Selector>
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "pl" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("should render multiple options", () => {
    render(
      <Selector {...defaultProps}>
        <option value="enUS">EN</option>
        <option value="pl">PL</option>
        <option value="de">DE</option>
        <option value="fr">FR</option>
      </Selector>
    );

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(4);
  });

  it("should handle option groups as children", () => {
    render(
      <Selector {...defaultProps}>
        <optgroup label="European">
          <option value="enUS">EN</option>
          <option value="pl">PL</option>
        </optgroup>
      </Selector>
    );

    expect(screen.getByRole("group", { name: "European" })).toBeInTheDocument();
  });

  it("should update displayed value when currentLanguage prop changes", () => {
    const { rerender } = render(
      <Selector {...defaultProps} currentLanguage="enUS">
        <option value="enUS">EN</option>
        <option value="pl">PL</option>
      </Selector>
    );

    expect(screen.getByRole("combobox")).toHaveValue("enUS");

    rerender(
      <Selector {...defaultProps} currentLanguage="pl">
        <option value="enUS">EN</option>
        <option value="pl">PL</option>
      </Selector>
    );

    expect(screen.getByRole("combobox")).toHaveValue("pl");
  });
});

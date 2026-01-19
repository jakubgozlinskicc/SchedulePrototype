import { it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { DatePicker } from "./DatePicker";
import { variantDefaults } from "./DatePicker.types";

vi.mock("react-datepicker", () => ({
  default: ({
    selected,
    onChange,
    showTimeSelect,
    dateFormat,
    placeholderText,
    minDate,
    maxDate,
    disabled,
    className,
  }: {
    selected: Date | null;
    onChange: (date: Date | null) => void;
    showTimeSelect?: boolean;
    dateFormat?: string;
    placeholderText?: string;
    minDate?: Date;
    maxDate?: Date;
    disabled?: boolean;
    className?: string;
  }) => (
    <input
      data-testid="date-picker"
      type="text"
      value={selected ? selected.toISOString() : ""}
      onChange={(e) =>
        onChange(e.target.value ? new Date(e.target.value) : null)
      }
      placeholder={placeholderText}
      disabled={disabled}
      className={className}
      data-show-time-select={showTimeSelect}
      data-date-format={dateFormat}
      data-min-date={minDate?.toISOString()}
      data-max-date={maxDate?.toISOString()}
    />
  ),
}));

vi.mock("../../locales/useTranslationContext", () => ({
  useTranslationContext: () => ({
    currentLanguage: "en",
  }),
}));

vi.mock("../../utils/calendarLocalizer/calendarLocalizer", () => ({
  locales: {
    en: { code: "en-US" },
    pl: { code: "pl" },
  },
}));

const mockOnChange = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

it("should render date picker", () => {
  render(<DatePicker value={null} onChange={mockOnChange} />);

  expect(screen.getByTestId("date-picker")).toBeInTheDocument();
});

it("should display selected date value", () => {
  const testDate = new Date("2025-01-15T10:00:00");

  render(<DatePicker value={testDate} onChange={mockOnChange} />);

  const input = screen.getByTestId("date-picker");
  expect(input).toHaveValue(testDate.toISOString());
});

it("should display empty value when date is null", () => {
  render(<DatePicker value={null} onChange={mockOnChange} />);

  const input = screen.getByTestId("date-picker");
  expect(input).toHaveValue("");
});

it("should display placeholder text", () => {
  render(
    <DatePicker
      value={null}
      onChange={mockOnChange}
      placeholderText="Select a date"
    />
  );

  const input = screen.getByTestId("date-picker");
  expect(input).toHaveAttribute("placeholder", "Select a date");
});

it("should be disabled when disabled prop is true", () => {
  render(<DatePicker value={null} onChange={mockOnChange} disabled={true} />);

  const input = screen.getByTestId("date-picker");
  expect(input).toBeDisabled();
});

it("should not be disabled when disabled prop is false", () => {
  render(<DatePicker value={null} onChange={mockOnChange} disabled={false} />);

  const input = screen.getByTestId("date-picker");
  expect(input).not.toBeDisabled();
});

it("should apply error class when error prop is true", () => {
  render(<DatePicker value={null} onChange={mockOnChange} error={true} />);

  const input = screen.getByTestId("date-picker");
  expect(input.className).toContain("error");
});

it("should not apply error class when error prop is false", () => {
  render(<DatePicker value={null} onChange={mockOnChange} error={false} />);

  const input = screen.getByTestId("date-picker");
  expect(input.className).not.toContain("error");
});

it("should apply custom className", () => {
  render(
    <DatePicker value={null} onChange={mockOnChange} className="custom-class" />
  );

  const input = screen.getByTestId("date-picker");
  expect(input.className).toContain("custom-class");
});

it("should use date variant config by default", () => {
  render(<DatePicker value={null} onChange={mockOnChange} />);

  const input = screen.getByTestId("date-picker");
  expect(input).toHaveAttribute(
    "data-show-time-select",
    String(variantDefaults.date.showTimeSelect)
  );
  expect(input).toHaveAttribute(
    "data-date-format",
    variantDefaults.date.dateFormat
  );
});

it("should use datetime variant config when variant is datetime", () => {
  render(
    <DatePicker value={null} onChange={mockOnChange} variant="datetime" />
  );

  const input = screen.getByTestId("date-picker");
  expect(input).toHaveAttribute(
    "data-show-time-select",
    String(variantDefaults.datetime.showTimeSelect)
  );
  expect(input).toHaveAttribute(
    "data-date-format",
    variantDefaults.datetime.dateFormat
  );
});

it("should pass minDate to date picker", () => {
  const minDate = new Date("2025-01-01");

  render(<DatePicker value={null} onChange={mockOnChange} minDate={minDate} />);

  const input = screen.getByTestId("date-picker");
  expect(input).toHaveAttribute("data-min-date", minDate.toISOString());
});

it("should pass maxDate to date picker", () => {
  const maxDate = new Date("2025-12-31");

  render(<DatePicker value={null} onChange={mockOnChange} maxDate={maxDate} />);

  const input = screen.getByTestId("date-picker");
  expect(input).toHaveAttribute("data-max-date", maxDate.toISOString());
});

it("should combine input class with error class when both apply", () => {
  render(
    <DatePicker
      value={null}
      onChange={mockOnChange}
      error={true}
      className="custom"
    />
  );

  const input = screen.getByTestId("date-picker");
  expect(input.className).toContain("input");
  expect(input.className).toContain("error");
  expect(input.className).toContain("custom");
});

it("should render with all props combined", () => {
  const testDate = new Date("2025-06-15T14:30:00");
  const minDate = new Date("2025-01-01");
  const maxDate = new Date("2025-12-31");

  render(
    <DatePicker
      value={testDate}
      onChange={mockOnChange}
      variant="datetime"
      placeholderText="Pick date and time"
      className="my-picker"
      minDate={minDate}
      maxDate={maxDate}
      error={false}
      disabled={false}
    />
  );

  const input = screen.getByTestId("date-picker");
  expect(input).toHaveValue(testDate.toISOString());
  expect(input).toHaveAttribute("placeholder", "Pick date and time");
  expect(input).toHaveAttribute("data-min-date", minDate.toISOString());
  expect(input).toHaveAttribute("data-max-date", maxDate.toISOString());
  expect(input).not.toBeDisabled();
  expect(input.className).toContain("my-picker");
});

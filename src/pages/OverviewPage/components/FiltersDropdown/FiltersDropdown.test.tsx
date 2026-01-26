import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FiltersDropdown } from "./FiltersDropdown";
import type { ComponentProps } from "react";
import { Button } from "../../../../components/Button/Button";
import { DatePicker } from "../../../../components/DatePicker/DatePicker";
import { ColorSelect } from "./ColorSelect";

type ButtonProps = ComponentProps<typeof Button>;
type DatePickerProps = ComponentProps<typeof DatePicker>;
type ColorSelectProps = ComponentProps<typeof ColorSelect>;

const mockUpdateFilter = vi.fn();
const mockResetFilters = vi.fn();

let mockFilters = {
  searchQuery: "",
  showPastEvents: false,
  dateFrom: null as Date | null,
  dateTo: null as Date | null,
  colors: [] as string[],
};

let mockActiveFiltersCount = 0;

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../../context/useFiltersContext", () => ({
  useFiltersContext: () => ({
    filters: mockFilters,
    activeFiltersCount: mockActiveFiltersCount,
    updateFilter: mockUpdateFilter,
    resetFilters: mockResetFilters,
  }),
}));

vi.mock("./ColorSelect", () => ({
  ColorSelect: ({ onChange }: ColorSelectProps) => (
    <div data-testid="color-select">
      <button onClick={() => onChange(["red"])}>Select Red</button>
    </div>
  ),
}));

vi.mock("../../../../components/DatePicker/DatePicker", () => ({
  DatePicker: ({ onChange, placeholderText, value }: DatePickerProps) => (
    <input
      placeholder={placeholderText}
      value={value ? "2024-06-15" : ""}
      onChange={() => onChange(new Date("2024-06-15"))}
    />
  ),
}));

vi.mock("../../../../components/Button/Button", () => ({
  Button: ({ children, onClick, variant }: ButtonProps) => (
    <button onClick={onClick} data-variant={variant}>
      {children}
    </button>
  ),
}));

describe("FiltersDropdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFilters = {
      searchQuery: "",
      showPastEvents: false,
      dateFrom: null,
      dateTo: null,
      colors: [],
    };
    mockActiveFiltersCount = 0;
  });

  it("should toggle dropdown when button is clicked", () => {
    render(<FiltersDropdown />);
    const toggleButton = screen.getByText("filters");

    expect(document.querySelector(".filters-panel.open")).toBeNull();
    fireEvent.click(toggleButton);
    expect(document.querySelector(".filters-panel.open")).toBeInTheDocument();
  });

  it("should update dateFrom when DatePicker changes", () => {
    render(<FiltersDropdown />);
    fireEvent.click(screen.getByText("filters"));

    const input = screen.getByPlaceholderText("select-date-from");
    fireEvent.change(input, { target: { value: "2024-06-15" } });

    expect(mockUpdateFilter).toHaveBeenCalledWith("dateFrom", expect.any(Date));
  });

  it("should call resetFilters when reset button is clicked", () => {
    render(<FiltersDropdown />);
    fireEvent.click(screen.getByText("filters"));

    fireEvent.click(screen.getByText("reset-filters"));
    expect(mockResetFilters).toHaveBeenCalled();
  });

  it("should close dropdown when clicking outside", () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <FiltersDropdown />
      </div>
    );

    fireEvent.click(screen.getByText("filters"));
    fireEvent.mouseDown(screen.getByTestId("outside"));

    expect(document.querySelector(".filters-panel.open")).toBeNull();
  });
});

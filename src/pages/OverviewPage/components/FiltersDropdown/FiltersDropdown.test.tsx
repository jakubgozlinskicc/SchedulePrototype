import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FiltersDropdown } from "./FiltersDropdown";

const mockUpdateFilter = vi.fn();
const mockResetFilters = vi.fn();

let mockFilters = {
  searchQuery: "",
  showPastEvents: false,
  dateFrom: null as Date | null,
  dateTo: null as Date | null,
  colors: [] as string[],
};

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../../context/useFiltersContext", () => ({
  useFiltersContext: () => ({
    filters: mockFilters,
    updateFilter: mockUpdateFilter,
    resetFilters: mockResetFilters,
  }),
}));

vi.mock("./ColorSelect", () => ({
  ColorSelect: ({
    selectedColors,
    onChange,
  }: {
    selectedColors: string[];
    onChange: (colors: string[]) => void;
  }) => (
    <div data-testid="color-select">
      <button onClick={() => onChange(["red"])}>Select Red</button>
      <span>Colors: {selectedColors.join(",")}</span>
    </div>
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
  });

  it("should render filters toggle button", () => {
    render(<FiltersDropdown />);

    expect(screen.getByText("filters")).toBeInTheDocument();
  });

  it("should toggle dropdown when button is clicked", () => {
    render(<FiltersDropdown />);

    const toggleButton = screen.getByText("filters");

    expect(document.querySelector(".filters-panel.open")).toBeNull();

    fireEvent.click(toggleButton);
    expect(document.querySelector(".filters-panel.open")).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(document.querySelector(".filters-panel.open")).toBeNull();
  });

  it("should show active filters count badge when filters are active", () => {
    mockFilters = {
      ...mockFilters,
      searchQuery: "test",
      showPastEvents: true,
      dateFrom: new Date(),
    };

    render(<FiltersDropdown />);

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("should not show badge when no active filters", () => {
    render(<FiltersDropdown />);

    expect(document.querySelector(".filters-badge")).toBeNull();
  });

  it("should update dateFrom when date input changes", () => {
    render(<FiltersDropdown />);

    fireEvent.click(screen.getByText("filters"));

    const dateInputs = document.querySelectorAll('input[type="date"]');

    fireEvent.change(dateInputs[0], { target: { value: "2024-06-15" } });

    expect(mockUpdateFilter).toHaveBeenCalledWith("dateFrom", expect.any(Date));
  });

  it("should update dateTo when date input changes", () => {
    render(<FiltersDropdown />);

    fireEvent.click(screen.getByText("filters"));

    const dateInputs = document.querySelectorAll('input[type="date"]');

    fireEvent.change(dateInputs[1], { target: { value: "2024-06-20" } });

    expect(mockUpdateFilter).toHaveBeenCalledWith("dateTo", expect.any(Date));
  });

  it("should clear dateFrom when empty value is provided", () => {
    mockFilters = {
      ...mockFilters,
      dateFrom: new Date("2024-06-15"),
    };

    render(<FiltersDropdown />);

    fireEvent.click(screen.getByText("filters"));

    const dateInputs = document.querySelectorAll('input[type="date"]');

    fireEvent.change(dateInputs[0], { target: { value: "" } });

    expect(mockUpdateFilter).toHaveBeenCalledWith("dateFrom", null);
  });

  it("should toggle showPastEvents when checkbox is clicked", () => {
    render(<FiltersDropdown />);

    fireEvent.click(screen.getByText("filters"));

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(mockUpdateFilter).toHaveBeenCalledWith("showPastEvents", true);
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
    expect(document.querySelector(".filters-panel.open")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(document.querySelector(".filters-panel.open")).toBeNull();
  });

  it("should format date correctly for input", () => {
    const testDate = new Date("2024-06-15T12:00:00");
    mockFilters = {
      ...mockFilters,
      dateFrom: testDate,
      dateTo: testDate,
    };

    render(<FiltersDropdown />);

    fireEvent.click(screen.getByText("filters"));

    const dateInputs = document.querySelectorAll(
      'input[type="date"]'
    ) as NodeListOf<HTMLInputElement>;

    expect(dateInputs[0].value).toBe("2024-06-15");
    expect(dateInputs[1].value).toBe("2024-06-15");
  });

  it("should count colors as active filter when colors are selected", () => {
    mockFilters = {
      ...mockFilters,
      colors: ["red", "blue"],
    };

    render(<FiltersDropdown />);

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should render ColorSelect component", () => {
    render(<FiltersDropdown />);

    fireEvent.click(screen.getByText("filters"));

    expect(screen.getByTestId("color-select")).toBeInTheDocument();
  });

  it("should display filter icons", () => {
    const { container } = render(<FiltersDropdown />);

    expect(container.querySelector(".fa-filter")).toBeInTheDocument();
  });

  it("should handle empty date string for dateTo", () => {
    mockFilters = {
      ...mockFilters,
      dateTo: new Date("2024-06-20"),
    };

    render(<FiltersDropdown />);

    fireEvent.click(screen.getByText("filters"));

    const dateInputs = document.querySelectorAll('input[type="date"]');

    fireEvent.change(dateInputs[1], { target: { value: "" } });

    expect(mockUpdateFilter).toHaveBeenCalledWith("dateTo", null);
  });
});

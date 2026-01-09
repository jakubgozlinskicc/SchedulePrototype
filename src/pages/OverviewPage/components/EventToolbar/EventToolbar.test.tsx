import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EventToolbar } from "./EventToolbar";

const mockNavigate = vi.fn();
const mockUpdateFilter = vi.fn();
const mockSetToday = vi.fn();
const mockHandleNext = vi.fn();
const mockHandlePrevious = vi.fn();
const mockChangeView = vi.fn();

let mockFilters = { searchQuery: "" };
let mockCurrentView = "month";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../context/useFiltersContext", () => ({
  useFiltersContext: () => ({
    filters: mockFilters,
    updateFilter: mockUpdateFilter,
  }),
}));

vi.mock("./useEventToolbar/useEventToolbar", () => ({
  useEventToolbar: () => ({
    currentView: mockCurrentView,
    setToday: mockSetToday,
    handleNext: mockHandleNext,
    handlePrevious: mockHandlePrevious,
    changeView: mockChangeView,
  }),
}));

vi.mock("../FiltersDropdown/FiltersDropdown", () => ({
  FiltersDropdown: () => (
    <div data-testid="filters-dropdown">FiltersDropdown</div>
  ),
}));

vi.mock("react-hot-toast", () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}));

describe("EventToolbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFilters = { searchQuery: "" };
    mockCurrentView = "month";
  });

  it("should render all toolbar elements", () => {
    render(<EventToolbar />);

    expect(screen.getByText("btn-add")).toBeInTheDocument();
    expect(screen.getByText("today")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("search-placeholder")
    ).toBeInTheDocument();
    expect(screen.getByText("month")).toBeInTheDocument();
    expect(screen.getByText("week")).toBeInTheDocument();
    expect(screen.getByText("day")).toBeInTheDocument();
    expect(screen.getByTestId("filters-dropdown")).toBeInTheDocument();
    expect(screen.getByTestId("toaster")).toBeInTheDocument();
  });

  it("should navigate to add event page when add button is clicked", () => {
    render(<EventToolbar />);

    fireEvent.click(screen.getByText("btn-add"));

    expect(mockNavigate).toHaveBeenCalledWith("/event/add");
  });

  it("should call setToday when today button is clicked", () => {
    render(<EventToolbar />);

    fireEvent.click(screen.getByText("today"));

    expect(mockSetToday).toHaveBeenCalled();
  });

  it("should call handlePrevious when left arrow button is clicked", () => {
    const { container } = render(<EventToolbar />);

    const prevButton = container.querySelector(".fa-arrow-left")?.parentElement;
    if (prevButton) {
      fireEvent.click(prevButton);
      expect(mockHandlePrevious).toHaveBeenCalled();
    }
  });

  it("should call handleNext when right arrow button is clicked", () => {
    const { container } = render(<EventToolbar />);

    const nextButton =
      container.querySelector(".fa-arrow-right")?.parentElement;
    if (nextButton) {
      fireEvent.click(nextButton);
      expect(mockHandleNext).toHaveBeenCalled();
    }
  });

  it("should update search query when typing in search input", () => {
    render(<EventToolbar />);

    const searchInput = screen.getByPlaceholderText("search-placeholder");
    fireEvent.change(searchInput, { target: { value: "test query" } });

    expect(mockUpdateFilter).toHaveBeenCalledWith("searchQuery", "test query");
  });

  it("should call changeView with 'month' when month button is clicked", () => {
    render(<EventToolbar />);

    fireEvent.click(screen.getByText("month"));

    expect(mockChangeView).toHaveBeenCalledWith("month");
  });

  it("should call changeView with 'week' when week button is clicked", () => {
    render(<EventToolbar />);

    fireEvent.click(screen.getByText("week"));

    expect(mockChangeView).toHaveBeenCalledWith("week");
  });

  it("should call changeView with 'day' when day button is clicked", () => {
    render(<EventToolbar />);

    fireEvent.click(screen.getByText("day"));

    expect(mockChangeView).toHaveBeenCalledWith("day");
  });

  it("should display current search query value", () => {
    mockFilters = { searchQuery: "existing query" };

    render(<EventToolbar />);

    const searchInput = screen.getByPlaceholderText(
      "search-placeholder"
    ) as HTMLInputElement;
    expect(searchInput.value).toBe("existing query");
  });

  it("should render navigation icons", () => {
    const { container } = render(<EventToolbar />);

    expect(container.querySelector(".fa-calendar-plus")).toBeInTheDocument();
    expect(container.querySelector(".fa-arrow-left")).toBeInTheDocument();
    expect(container.querySelector(".fa-arrow-right")).toBeInTheDocument();
    expect(container.querySelector(".fa-magnifying-glass")).toBeInTheDocument();
  });
});

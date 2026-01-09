import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CustomToolbar } from "./customToolbar";
import type { ToolbarProps } from "react-big-calendar";
import type { Event } from "../../../../../db/scheduleDb";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "btn-add": "Add",
        today: "Today",
        month: "Month",
        week: "Week",
        day: "Day",
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock("../../../../../locales/useTranslationContext", () => ({
  useTranslationContext: () => ({
    currentLanguage: "enUS",
    changeLanguage: vi.fn(),
  }),
}));

vi.mock("../../../../../utils/calendarLocalizer/calendarLocalizer", () => ({
  locales: {
    enUS: undefined,
    pl: undefined,
  },
}));

const mockToggleDatePicker = vi.fn();
const MockDatePickerComponent = () => (
  <div data-testid="date-picker">DatePicker</div>
);

vi.mock("../useCustomToolbar/useDatePicker/useDatePicker", () => ({
  useDatePicker: () => ({
    isDatePickerOpen: false,
    datePickerRef: { current: null },
    handleDateChange: vi.fn(),
    toggleDatePicker: mockToggleDatePicker,
    DatePickerComponent: MockDatePickerComponent,
  }),
}));

vi.mock("./WeekStrip", () => ({
  WeekStrip: ({
    onNavigate,
    onView,
  }: {
    onNavigate: (action: string, date?: Date) => void;
    onView: (view: string) => void;
  }) => (
    <div className="week-strip">
      {Array.from({ length: 7 }).map((_, i) => (
        <button
          key={i}
          className={`week-strip-day ${i === 0 ? "active-day" : ""}`}
          onClick={() => {
            onView("day");
            onNavigate("DATE", new Date());
          }}
        >
          Day {i}
        </button>
      ))}
    </div>
  ),
}));

describe("CustomToolbar", () => {
  let mockProps: ToolbarProps<Event, object> & { onAddEvent: () => void };

  beforeEach(() => {
    vi.clearAllMocks();

    mockProps = {
      date: new Date("2025-06-15T10:00:00"),
      label: "June 2025",
      view: "month",
      views: ["month", "week", "day"],
      onNavigate: vi.fn(),
      onView: vi.fn(),
      onAddEvent: vi.fn(),
      localizer: {} as ToolbarProps<Event, object>["localizer"],
    };
  });

  it("should render toolbar with all buttons", () => {
    const { container } = render(<CustomToolbar {...mockProps} />);
    expect(screen.getByText("Add")).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Month")).toBeInTheDocument();
    expect(screen.getByText("Week")).toBeInTheDocument();
    expect(screen.getByText("Day")).toBeInTheDocument();
    expect(container.querySelector(".fa-arrow-left")).toBeInTheDocument();
    expect(container.querySelector(".fa-arrow-right")).toBeInTheDocument();
  });

  it("should render label", () => {
    render(<CustomToolbar {...mockProps} />);

    expect(screen.getByText("June 2025")).toBeInTheDocument();
  });

  it("should not render Add button when onAddEvent is undefined", () => {
    const propsWithoutAdd = {
      ...mockProps,
      onAddEvent: undefined as unknown as () => void,
    };

    render(<CustomToolbar {...propsWithoutAdd} />);

    expect(screen.queryByText("Add")).not.toBeInTheDocument();
  });

  it("should call onNavigate with TODAY when Today button is clicked", () => {
    render(<CustomToolbar {...mockProps} />);

    fireEvent.click(screen.getByText("Today"));

    expect(mockProps.onNavigate).toHaveBeenCalledWith("TODAY");
  });

  it("should call onNavigate with PREV when left arrow is clicked", () => {
    const { container } = render(<CustomToolbar {...mockProps} />);

    const leftArrow = container.querySelector(".fa-arrow-left");
    fireEvent.click(leftArrow!);

    expect(mockProps.onNavigate).toHaveBeenCalledWith("PREV");
  });

  it("should call onNavigate with NEXT when right arrow is clicked", () => {
    const { container } = render(<CustomToolbar {...mockProps} />);

    const rightArrow = container.querySelector(".fa-arrow-right");
    fireEvent.click(rightArrow!);

    expect(mockProps.onNavigate).toHaveBeenCalledWith("NEXT");
  });

  it("should call onView with month when Month button is clicked", () => {
    render(<CustomToolbar {...mockProps} />);

    fireEvent.click(screen.getByText("Month"));

    expect(mockProps.onView).toHaveBeenCalledWith("month");
  });

  it("should call onView with week when Week button is clicked", () => {
    render(<CustomToolbar {...mockProps} />);

    fireEvent.click(screen.getByText("Week"));

    expect(mockProps.onView).toHaveBeenCalledWith("week");
  });

  it("should call onView with day when Day button is clicked", () => {
    render(<CustomToolbar {...mockProps} />);

    fireEvent.click(screen.getByText("Day"));

    expect(mockProps.onView).toHaveBeenCalledWith("day");
  });

  it("should call onAddEvent when Add button is clicked", () => {
    render(<CustomToolbar {...mockProps} />);

    fireEvent.click(screen.getByText("Add"));

    expect(mockProps.onAddEvent).toHaveBeenCalledTimes(1);
  });

  it("should not render WeekStrip when view is month", () => {
    render(<CustomToolbar {...mockProps} />);

    const weekStrip = document.querySelector(".week-strip");
    expect(weekStrip).not.toBeInTheDocument();
  });

  it("should not render WeekStrip when view is week", () => {
    const weekProps = { ...mockProps, view: "week" as const };

    render(<CustomToolbar {...weekProps} />);

    const weekStrip = document.querySelector(".week-strip");
    expect(weekStrip).not.toBeInTheDocument();
  });

  it("should render WeekStrip when view is day", () => {
    const dayProps = { ...mockProps, view: "day" as const };

    render(<CustomToolbar {...dayProps} />);

    const weekStrip = document.querySelector(".week-strip");
    expect(weekStrip).toBeInTheDocument();

    const weekStripButtons = document.querySelectorAll(".week-strip-day");
    expect(weekStripButtons.length).toBe(7);
  });

  it("should highlight current day in WeekStrip", () => {
    const dayProps = {
      ...mockProps,
      view: "day" as const,
      date: new Date("2025-06-18T10:00:00"),
    };

    render(<CustomToolbar {...dayProps} />);

    const activeDay = document.querySelector(".active-day");
    expect(activeDay).toBeInTheDocument();
  });

  it("should navigate to selected day when WeekStrip day is clicked", () => {
    const dayProps = { ...mockProps, view: "day" as const };

    render(<CustomToolbar {...dayProps} />);

    const weekStripButtons = document.querySelectorAll(".week-strip-day");
    fireEvent.click(weekStripButtons[0]);

    expect(mockProps.onView).toHaveBeenCalledWith("day");
    expect(mockProps.onNavigate).toHaveBeenCalledWith("DATE", expect.any(Date));
  });

  it("should display different label for week view", () => {
    const weekProps = { ...mockProps, label: "Jun 09 – 15, 2025" };

    render(<CustomToolbar {...weekProps} />);

    expect(screen.getByText("Jun 09 – 15, 2025")).toBeInTheDocument();
  });

  it("should display different label for day view", () => {
    const dayProps = {
      ...mockProps,
      view: "day" as const,
      label: "Sunday Jun 15",
    };

    render(<CustomToolbar {...dayProps} />);

    expect(screen.getByText("Sunday Jun 15")).toBeInTheDocument();
  });

  it("should toggle date picker when label is clicked", () => {
    render(<CustomToolbar {...mockProps} />);

    fireEvent.click(screen.getByText("June 2025"));

    expect(mockToggleDatePicker).toHaveBeenCalledTimes(1);
  });

  it("should render calendar icon", () => {
    const { container } = render(<CustomToolbar {...mockProps} />);

    expect(container.querySelector(".fa-calendar")).toBeInTheDocument();
  });
});

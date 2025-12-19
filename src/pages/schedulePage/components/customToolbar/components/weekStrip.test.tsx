import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WeekStrip } from "./WeekStrip";
import type { NavigateAction } from "react-big-calendar";

vi.mock("../../../../../locales/useTranslationContext", () => ({
  useTranslationContext: () => ({
    currentLanguage: "enUS",
  }),
}));

vi.mock("../../../../../utils/calendarLocalizer/calendarLocalizer", () => ({
  locales: {
    enUS: undefined,
    pl: undefined,
  },
}));

describe("WeekStrip", () => {
  let mockOnNavigate: (action: NavigateAction, newDate?: Date) => void;
  let mockOnView: (view: "month" | "week" | "day") => void;

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnNavigate = vi.fn();
    mockOnView = vi.fn();
  });

  it("should render 7 days", () => {
    render(
      <WeekStrip
        date={new Date("2025-06-18T10:00:00")}
        onNavigate={mockOnNavigate}
        onView={mockOnView}
      />
    );

    const days = document.querySelectorAll(".week-strip-day");
    expect(days.length).toBe(7);
  });

  it("should highlight active day", () => {
    render(
      <WeekStrip
        date={new Date("2025-06-18T10:00:00")}
        onNavigate={mockOnNavigate}
        onView={mockOnView}
      />
    );

    const activeDay = document.querySelector(".active-day");
    expect(activeDay).toBeInTheDocument();
  });

  it("should call onView and onNavigate when day is clicked", () => {
    render(
      <WeekStrip
        date={new Date("2025-06-18T10:00:00")}
        onNavigate={mockOnNavigate}
        onView={mockOnView}
      />
    );

    const days = document.querySelectorAll(".week-strip-day");
    fireEvent.click(days[0]);

    expect(mockOnView).toHaveBeenCalledWith("day");
    expect(mockOnNavigate).toHaveBeenCalledWith("DATE", expect.any(Date));
  });

  it("should start week on Monday", () => {
    render(
      <WeekStrip
        date={new Date("2025-06-18T10:00:00")}
        onNavigate={mockOnNavigate}
        onView={mockOnView}
      />
    );

    const days = screen.getAllByRole("button");
    expect(days[0].textContent).toContain("Mon");
  });

  it("should display day names with dates", () => {
    render(
      <WeekStrip
        date={new Date("2025-06-18T10:00:00")}
        onNavigate={mockOnNavigate}
        onView={mockOnView}
      />
    );

    const days = screen.getAllByRole("button");
    days.forEach((day) => {
      expect(day.textContent).toMatch(/\w{3} \d{2}/);
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import SchedulePage from "../pages/schedulePage/schedulePage";
import { EventDataProvider } from "../contexts/eventDataProvider";

vi.mock("../useEvents/useEventsData");
vi.mock("../useEvents/useEventComponents/useEventModal");
vi.mock("../useEvents/useEventComponents/useEventForm");
vi.mock("../useEvents/useEventCalendar/useEventDropResize");
vi.mock("../useEvents/useEventComponents/useEventHover");
vi.mock("../useEvents/useEventCalendar/useSelectEvent");
vi.mock("../useEvents/useEventCalendar/useSelectSlot");

describe("SchedulePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the schedule page with header", () => {
    render(
      <EventDataProvider>
        <SchedulePage />
      </EventDataProvider>
    );

    expect(screen.getByText("Schedule")).toBeInTheDocument();
  });

  it("should render calendar section", () => {
    const { container } = render(
      <EventDataProvider>
        <SchedulePage />
      </EventDataProvider>
    );

    expect(container.querySelector(".calendar-section")).toBeInTheDocument();
  });
});

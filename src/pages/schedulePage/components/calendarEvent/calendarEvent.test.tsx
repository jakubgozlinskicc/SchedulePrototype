import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CalendarEvent } from "./calendarEvent";
import type { Event } from "../../../../db/scheduleDb";

const mockIsHovering = vi.fn(() => false);
vi.mock("usehooks-ts", () => ({
  useHover: () => mockIsHovering(),
}));

vi.mock("../eventHover/eventHover", () => ({
  EventHover: ({
    event,
    position,
  }: {
    event: Event;
    position: { x: number; y: number };
  }) => (
    <div data-testid="event-hover">
      <span data-testid="hover-title">{event.title}</span>
      <span data-testid="hover-position-x">{position.x}</span>
      <span data-testid="hover-position-y">{position.y}</span>
    </div>
  ),
}));

describe("CalendarEvent", () => {
  let mockEvent: Event;

  beforeEach(() => {
    vi.clearAllMocks();
    mockIsHovering.mockReturnValue(false);

    mockEvent = {
      id: 1,
      title: "Test Event",
      description: "Test description",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#FF0000",
    };
  });

  it("It should render event title", () => {
    render(<CalendarEvent event={mockEvent} />);

    expect(screen.getByText("Test Event")).toBeInTheDocument();
  });

  it("It should not show EventHover when not hovering", () => {
    mockIsHovering.mockReturnValue(false);

    render(<CalendarEvent event={mockEvent} />);

    expect(screen.queryByTestId("event-hover")).not.toBeInTheDocument();
  });

  it("It should show EventHover when hovering", () => {
    mockIsHovering.mockReturnValue(true);

    render(<CalendarEvent event={mockEvent} />);

    expect(screen.getByTestId("event-hover")).toBeInTheDocument();
    expect(screen.getByTestId("hover-title")).toHaveTextContent("Test Event");
  });

  it("It should update position on mouse move", async () => {
    mockIsHovering.mockReturnValue(true);

    render(<CalendarEvent event={mockEvent} />);

    const eventElements = screen.getAllByText("Test Event");
    const eventDiv = eventElements[0];

    fireEvent(
      eventDiv,
      new MouseEvent("mousemove", {
        bubbles: true,
        clientX: 100,
        clientY: 200,
      })
    );

    expect(screen.getByTestId("hover-position-x")).toHaveTextContent("100");
    expect(screen.getByTestId("hover-position-y")).toHaveTextContent("200");
  });

  it("It should have correct inline styles on container div", () => {
    render(<CalendarEvent event={mockEvent} />);

    const eventDiv = screen.getByText("Test Event");

    expect(eventDiv.style.height).toBe("100%");
    expect(eventDiv.style.cursor).toBe("pointer");
  });

  it("It should pass event data to EventHover", () => {
    mockIsHovering.mockReturnValue(true);

    render(<CalendarEvent event={mockEvent} />);

    expect(screen.getByTestId("hover-title")).toHaveTextContent(
      mockEvent.title
    );
  });

  it("It should render EventHover in portal (document.body)", () => {
    mockIsHovering.mockReturnValue(true);

    render(<CalendarEvent event={mockEvent} />);

    const hoverElement = document.body.querySelector(
      '[data-testid="event-hover"]'
    );
    expect(hoverElement).toBeInTheDocument();
  });

  it("It should track multiple mouse movements", () => {
    mockIsHovering.mockReturnValue(true);

    render(<CalendarEvent event={mockEvent} />);

    const eventElements = screen.getAllByText("Test Event");
    const eventDiv = eventElements[0];

    fireEvent(
      eventDiv,
      new MouseEvent("mousemove", {
        bubbles: true,
        clientX: 50,
        clientY: 75,
      })
    );
    expect(screen.getByTestId("hover-position-x")).toHaveTextContent("50");
    expect(screen.getByTestId("hover-position-y")).toHaveTextContent("75");

    fireEvent(
      eventDiv,
      new MouseEvent("mousemove", {
        bubbles: true,
        clientX: 300,
        clientY: 400,
      })
    );
    expect(screen.getByTestId("hover-position-x")).toHaveTextContent("300");
    expect(screen.getByTestId("hover-position-y")).toHaveTextContent("400");
  });

  it("It should render with event without id", () => {
    const eventWithoutId: Event = {
      title: "No ID Event",
      description: "Description",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#00FF00",
    };

    render(<CalendarEvent event={eventWithoutId} />);

    expect(screen.getByText("No ID Event")).toBeInTheDocument();
  });

  it("It should render with empty description", () => {
    mockEvent.description = "";

    render(<CalendarEvent event={mockEvent} />);

    expect(screen.getByText("Test Event")).toBeInTheDocument();
  });
});

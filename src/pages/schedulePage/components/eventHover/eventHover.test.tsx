import { render, screen } from "@testing-library/react";
import { EventHover } from "./eventHover";
import type { Event } from "../../../../db/scheduleDb";
import { vi, describe, beforeEach, it, expect } from "vitest";

vi.mock("../../../../utils/getTextColor/getTextColor", () => ({
  getTextColor: vi.fn(() => "white"),
}));

import { getTextColor } from "../../../../utils/getTextColor/getTextColor";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("EventHover", () => {
  const mockEvent: Event = {
    id: 1,
    title: "Test Event",
    description: "Test Description",
    start: new Date("2024-01-01T10:00:00"),
    end: new Date("2024-01-01T11:00:00"),
    color: "#3b82f6",
  };

  const mockPosition = { x: 100, y: 100 };

  beforeEach(() => {
    vi.clearAllMocks();
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 200,
      height: 150,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
  });

  it("It should render event hover with title", () => {
    render(<EventHover event={mockEvent} position={mockPosition} />);
    expect(screen.getByText("Test Event")).toBeInTheDocument();
  });

  it("It should render event description", () => {
    render(<EventHover event={mockEvent} position={mockPosition} />);
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("It should render start date label", () => {
    render(<EventHover event={mockEvent} position={mockPosition} />);
    expect(
      screen.getByText("start-date:", { exact: false })
    ).toBeInTheDocument();
  });

  it("It should render end date label", () => {
    render(<EventHover event={mockEvent} position={mockPosition} />);
    expect(screen.getByText("end-date:", { exact: false })).toBeInTheDocument();
  });

  it("It should render description label", () => {
    render(<EventHover event={mockEvent} position={mockPosition} />);
    expect(
      screen.getByText("description:", { exact: false })
    ).toBeInTheDocument();
  });

  it("It should display start date value", () => {
    render(<EventHover event={mockEvent} position={mockPosition} />);
    const startDateString = mockEvent.start.toLocaleString();
    expect(screen.getByText(startDateString)).toBeInTheDocument();
  });

  it("It should display end date value", () => {
    render(<EventHover event={mockEvent} position={mockPosition} />);
    const endDateString = mockEvent.end.toLocaleString();
    expect(screen.getByText(endDateString)).toBeInTheDocument();
  });

  it("It should render footer with edit hint", () => {
    render(<EventHover event={mockEvent} position={mockPosition} />);
    expect(screen.getByText("hover-footer")).toBeInTheDocument();
  });

  it("It should display 'missing-description' when description is empty", () => {
    const eventWithoutDescription: Event = {
      ...mockEvent,
      description: "",
    };
    render(
      <EventHover event={eventWithoutDescription} position={mockPosition} />
    );
    expect(screen.getByText("missing-description")).toBeInTheDocument();
  });

  it("It should apply correct background color to header", () => {
    const { container } = render(
      <EventHover event={mockEvent} position={mockPosition} />
    );
    const header = container.querySelector(".hover-header");
    expect(header).toHaveStyle({ backgroundColor: "#3b82f6" });
  });

  it("It should call getTextColor with event color", () => {
    render(<EventHover event={mockEvent} position={mockPosition} />);
    expect(getTextColor).toHaveBeenCalledWith("#3b82f6");
  });

  it("It should use original position on initial render (element not yet in DOM)", () => {
    const { container } = render(
      <EventHover event={mockEvent} position={mockPosition} />
    );
    const hover = container.querySelector(".event-hover");
    expect(hover).toHaveStyle({
      left: "100px",
      top: "100px",
    });
  });
});

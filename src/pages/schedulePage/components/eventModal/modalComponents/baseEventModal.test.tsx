import { render, screen } from "@testing-library/react";
import { BaseEventModal } from "./BaseEventModal";
import type { Event } from "../../../../../db/scheduleDb";
import { vi, describe, beforeEach, it, expect } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock(
  "../../../../../events/form/EventForm/useEventForm/useEventFormSchema/useEventFormSchema",
  () => ({
    useEventFormSchema: () => ({
      eventFormSchema: {
        validateSync: vi.fn(),
      },
    }),
  })
);

vi.mock("../../../../../events/form/EventForm/EventFormFields", () => ({
  EventFormFields: () => (
    <div data-testid="event-form-fields">
      <label>title</label>
      <input name="title" defaultValue="Test Event" />
      <label>description</label>
      <textarea name="description" defaultValue="Test Description" />
      <label>start-date</label>
      <input
        name="start"
        type="datetime-local"
        defaultValue="2024-01-01T10:00"
      />
      <label>end-date</label>
      <input name="end" type="datetime-local" defaultValue="2024-01-01T11:00" />
      <label>color</label>
      <input name="color" type="color" defaultValue="#3b82f6" />
    </div>
  ),
}));

describe("BaseEventModal", () => {
  const mockEventData: Event = {
    id: 1,
    title: "Test Event",
    description: "Test Description",
    start: new Date("2024-01-01T10:00:00"),
    end: new Date("2024-01-01T11:00:00"),
    color: "#3b82f6",
  };

  const mockProps = {
    title: "Test Modal Title",
    eventData: mockEventData,
    onSubmit: vi.fn(),
    children: <button type="submit">Test Button</button>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("It should render modal with correct title", () => {
    render(<BaseEventModal {...mockProps} />);
    expect(screen.getByText("Test Modal Title")).toBeInTheDocument();
  });

  it("It should render all form fields with labels", () => {
    render(<BaseEventModal {...mockProps} />);
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("description")).toBeInTheDocument();
    expect(screen.getByText("start-date")).toBeInTheDocument();
    expect(screen.getByText("end-date")).toBeInTheDocument();
    expect(screen.getByText("color")).toBeInTheDocument();
  });

  it("It should render form inputs", () => {
    render(<BaseEventModal {...mockProps} />);
    expect(screen.getByTestId("event-form-fields")).toBeInTheDocument();
  });

  it("It should render children in modal-actions", () => {
    render(<BaseEventModal {...mockProps} />);
    expect(screen.getByText("Test Button")).toBeInTheDocument();
  });

  it("It should render modal-backdrop", () => {
    const { container } = render(<BaseEventModal {...mockProps} />);
    const backdrop = container.querySelector(".modal-backdrop");
    expect(backdrop).toBeInTheDocument();
  });

  it("It should render with empty event data", () => {
    const emptyEvent: Event = {
      title: "",
      description: "",
      start: new Date(),
      end: new Date(),
      color: "#000000",
    };
    render(<BaseEventModal {...mockProps} eventData={emptyEvent} />);
    expect(screen.getByTestId("event-form-fields")).toBeInTheDocument();
  });

  it("It should have form element", () => {
    const { container } = render(<BaseEventModal {...mockProps} />);
    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { AddEventModal } from "./AddEventModal";
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
      <input name="title" />
      <label>description</label>
      <textarea name="description" />
      <label>start-date</label>
      <input name="start" type="datetime-local" />
      <label>end-date</label>
      <input name="end" type="datetime-local" />
      <label>color</label>
      <input name="color" type="color" defaultValue="#3b82f6" />
    </div>
  ),
}));

describe("AddEventModal", () => {
  const mockEventData: Event = {
    title: "",
    description: "",
    start: new Date("2024-01-01T10:00"),
    end: new Date("2024-01-01T11:00"),
    color: "#3b82f6",
  };

  const mockProps = {
    eventData: mockEventData,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("It should render add event modal with correct title", () => {
    render(<AddEventModal {...mockProps} />);
    expect(screen.getByText("add_title")).toBeInTheDocument();
  });

  it("It should render cancel and add buttons", () => {
    render(<AddEventModal {...mockProps} />);
    expect(screen.getByText("btn_cancel")).toBeInTheDocument();
    expect(screen.getByText("btn-add")).toBeInTheDocument();
  });

  it("It should call onClose when cancel button is clicked", () => {
    render(<AddEventModal {...mockProps} />);
    const cancelButton = screen.getByText("btn_cancel");
    fireEvent.click(cancelButton);
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("It should have submit button", () => {
    render(<AddEventModal {...mockProps} />);
    const addButton = screen.getByText("btn-add");
    expect(addButton).toHaveAttribute("type", "submit");
  });

  it("It should render modal", () => {
    const { container } = render(<AddEventModal {...mockProps} />);
    const modal = container.querySelector(".modal");
    expect(modal).toBeInTheDocument();
  });

  it("It should pass all props correctly to BaseEventModal", () => {
    render(<AddEventModal {...mockProps} />);
    expect(screen.getByTestId("event-form-fields")).toBeInTheDocument();
  });

  it("It should render with all form fields from BaseEventModal", () => {
    render(<AddEventModal {...mockProps} />);
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("description")).toBeInTheDocument();
    expect(screen.getByText("start-date")).toBeInTheDocument();
    expect(screen.getByText("end-date")).toBeInTheDocument();
    expect(screen.getByText("color")).toBeInTheDocument();
  });
});

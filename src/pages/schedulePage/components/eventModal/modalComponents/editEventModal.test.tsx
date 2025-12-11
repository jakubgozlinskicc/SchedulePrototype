import { render, screen, fireEvent } from "@testing-library/react";
import { EditEventModal } from "../modalComponents/editEventModal";
import type { Event } from "../../../../../db/scheduleDb";
import { vi, describe, beforeEach, it, expect } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("EditEventModal", () => {
  const mockEventData: Event = {
    id: 1,
    title: "Test Event",
    description: "Test Description",
    start: new Date("2024-01-01T10:00"),
    end: new Date("2024-01-01T11:00"),
    color: "#3b82f6",
  };

  const mockProps = {
    eventData: mockEventData,
    isShaking: false,
    onChange: vi.fn(),
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    onRequestDelete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("It should render edit event modal with correct title", () => {
    render(<EditEventModal {...mockProps} />);
    expect(screen.getByText("modal_edit_title")).toBeInTheDocument();
  });

  it("It should render delete, cancel and save changes buttons", () => {
    render(<EditEventModal {...mockProps} />);
    expect(screen.getByText("btn_delete")).toBeInTheDocument();
    expect(screen.getByText("btn_cancel")).toBeInTheDocument();
    expect(screen.getByText("btn_save_changes")).toBeInTheDocument();
  });

  it("It should call onRequestDelete when delete button is clicked", () => {
    render(<EditEventModal {...mockProps} />);
    const deleteButton = screen.getByText("btn_delete");
    fireEvent.click(deleteButton);
    expect(mockProps.onRequestDelete).toHaveBeenCalledTimes(1);
  });

  it("It should call onClose when cancel button is clicked", () => {
    render(<EditEventModal {...mockProps} />);
    const cancelButton = screen.getByText("btn_cancel");
    fireEvent.click(cancelButton);
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("It should call onSubmit when save changes button is clicked", () => {
    render(<EditEventModal {...mockProps} />);
    const saveButton = screen.getByText("btn_save_changes");
    fireEvent.click(saveButton);
    expect(mockProps.onSubmit).toHaveBeenCalled();
  });

  it("It should apply shake class when isShaking is true", () => {
    const { container } = render(
      <EditEventModal {...mockProps} isShaking={true} />
    );
    const modal = container.querySelector(".modal");
    expect(modal).toHaveClass("shake");
  });

  it("It should do not apply shake class when isShaking is false", () => {
    const { container } = render(<EditEventModal {...mockProps} />);
    const modal = container.querySelector(".modal");
    expect(modal).not.toHaveClass("shake");
  });

  it("It should pass all props correctly to BaseEventModal", () => {
    render(<EditEventModal {...mockProps} />);
    expect(screen.getByDisplayValue(mockEventData.title)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(mockEventData.description)
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockEventData.color)).toBeInTheDocument();
  });

  it("It should render with all form fields from BaseEventModal", () => {
    render(<EditEventModal {...mockProps} />);
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("description")).toBeInTheDocument();
    expect(screen.getByText("start-date")).toBeInTheDocument();
    expect(screen.getByText("end-date")).toBeInTheDocument();
    expect(screen.getByText("color")).toBeInTheDocument();
  });

  it("It should handle async onRequestDelete", async () => {
    const asyncDelete = vi.fn().mockResolvedValue(undefined);
    render(<EditEventModal {...mockProps} onRequestDelete={asyncDelete} />);
    const deleteButton = screen.getByText("btn_delete");
    fireEvent.click(deleteButton);
    expect(asyncDelete).toHaveBeenCalledTimes(1);
  });
});

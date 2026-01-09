import { render, screen, fireEvent } from "@testing-library/react";
import { AddEventModal } from "../modalComponents/addEventModal";
import type { Event } from "../../../../../db/scheduleDb";
import { vi, describe, beforeEach, it, expect } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
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
    isShaking: false,
    onChange: vi.fn(),
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

  it("It should call onSubmit when add button is clicked", () => {
    render(<AddEventModal {...mockProps} />);
    const addButton = screen.getByText("btn-add");
    fireEvent.click(addButton);
    expect(mockProps.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("It should apply shake class when isShaking is true", () => {
    const { container } = render(
      <AddEventModal {...mockProps} isShaking={true} />
    );
    const modal = container.querySelector(".modal");
    expect(modal).toHaveClass("shake");
  });

  it("It should do not apply shake class when isShaking is false", () => {
    const { container } = render(<AddEventModal {...mockProps} />);
    const modal = container.querySelector(".modal");
    expect(modal).not.toHaveClass("shake");
  });

  it("It should pass all props correctly to BaseEventModal", () => {
    render(<AddEventModal {...mockProps} />);
    expect(screen.getByDisplayValue(mockEventData.color)).toBeInTheDocument();
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

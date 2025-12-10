import { render, screen, fireEvent } from "@testing-library/react";
import { BaseEventModal } from "../modalComponents/baseEventModal";
import type { Event } from "../../../../../db/scheduleDb";
import { vi, describe, beforeEach, it, expect } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../../../../../utils/toDateTimeLocal", () => ({
  toDateTimeLocal: (date: Date) => {
    return date.toISOString().slice(0, 16);
  },
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
    isShaking: false,
    onChange: vi.fn(),
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    children: <button>Test Button</button>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal with correct title", () => {
    render(<BaseEventModal {...mockProps} />);
    expect(screen.getByText("Test Modal Title")).toBeInTheDocument();
  });

  it("renders all form fields with labels", () => {
    render(<BaseEventModal {...mockProps} />);
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("description")).toBeInTheDocument();
    expect(screen.getByText("start-date")).toBeInTheDocument();
    expect(screen.getByText("end-date")).toBeInTheDocument();
    expect(screen.getByText("color")).toBeInTheDocument();
  });

  it("renders form inputs with correct values", () => {
    render(<BaseEventModal {...mockProps} />);
    expect(screen.getByDisplayValue("Test Event")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
    expect(screen.getByDisplayValue("#3b82f6")).toBeInTheDocument();
  });

  it("calls onChange when title input changes", () => {
    render(<BaseEventModal {...mockProps} />);
    const titleInput = screen.getByDisplayValue("Test Event");
    fireEvent.change(titleInput, { target: { value: "New Title" } });
    expect(mockProps.onChange).toHaveBeenCalled();
  });

  it("calls onChange when description textarea changes", () => {
    render(<BaseEventModal {...mockProps} />);
    const descriptionTextarea = screen.getByDisplayValue("Test Description");
    fireEvent.change(descriptionTextarea, {
      target: { value: "New Description" },
    });
    expect(mockProps.onChange).toHaveBeenCalled();
  });

  it("calls onChange when start date input changes", () => {
    render(<BaseEventModal {...mockProps} />);
    const startInput = screen.getByDisplayValue("2024-01-01T10:00");
    fireEvent.change(startInput, { target: { value: "2024-01-02T10:00" } });
    expect(mockProps.onChange).toHaveBeenCalled();
  });

  it("calls onChange when end date input changes", () => {
    render(<BaseEventModal {...mockProps} />);
    const endInput = screen.getByDisplayValue("2024-01-01T10:00");
    fireEvent.change(endInput, { target: { value: "2024-01-02T10:00" } });
    expect(mockProps.onChange).toHaveBeenCalled();
  });

  it("calls onChange when color input changes", () => {
    render(<BaseEventModal {...mockProps} />);
    const colorInput = screen.getByDisplayValue("#3b82f6");
    fireEvent.change(colorInput, { target: { value: "#ff0000" } });
    expect(mockProps.onChange).toHaveBeenCalled();
  });

  it("calls onSubmit when form is submitted", () => {
    const { container } = render(<BaseEventModal {...mockProps} />);
    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
    if (form) {
      fireEvent.submit(form);
      expect(mockProps.onSubmit).toHaveBeenCalled();
    }
  });

  it("renders children in modal-actions", () => {
    render(<BaseEventModal {...mockProps} />);
    expect(screen.getByText("Test Button")).toBeInTheDocument();
  });

  it("applies shake class when isShaking is true", () => {
    const { container } = render(
      <BaseEventModal {...mockProps} isShaking={true} />
    );
    const modal = container.querySelector(".modal");
    expect(modal).toHaveClass("shake");
  });

  it("does not apply shake class when isShaking is false", () => {
    const { container } = render(<BaseEventModal {...mockProps} />);
    const modal = container.querySelector(".modal");
    expect(modal).not.toHaveClass("shake");
  });

  it("renders modal-backdrop", () => {
    const { container } = render(<BaseEventModal {...mockProps} />);
    const backdrop = container.querySelector(".modal-backdrop");
    expect(backdrop).toBeInTheDocument();
  });

  it("renders with empty event data", () => {
    const emptyEvent: Event = {
      title: "",
      description: "",
      start: new Date(),
      end: new Date(),
      color: "#000000",
    };
    const { container } = render(
      <BaseEventModal {...mockProps} eventData={emptyEvent} />
    );
    const titleInput = container.querySelector('input[name="title"]');
    expect(titleInput).toHaveValue("");
  });
});

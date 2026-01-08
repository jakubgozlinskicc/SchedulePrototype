import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EditRecurringEventModal } from "./editRecurringEventModal";
import type { Event } from "../../../../../db/scheduleDb";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("./baseEventModal", () => ({
  BaseEventModal: ({
    title,
    children,
    onClose,
    onSubmit,
  }: {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    onSubmit: () => void;
  }) => (
    <div data-testid="base-event-modal">
      <h3>{title}</h3>
      <form onSubmit={onSubmit}>
        {children}
        <button type="button" onClick={onClose}>
          close
        </button>
      </form>
    </div>
  ),
}));

describe("EditRecurringEventModal", () => {
  let mockEventData: Event;
  let mockOnChange: () => void;
  let mockOnClose: () => void;
  let mockOnSubmit: () => void;
  let mockOnRequestDelete: () => void;
  let mockOnEditSingle: () => void;
  let mockOnEditAll: () => void;

  beforeEach(() => {
    vi.clearAllMocks();

    mockEventData = {
      id: 1,
      title: "Test event",
      description: "Test description",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1 },
    };

    mockOnChange = vi.fn();
    mockOnClose = vi.fn();
    mockOnSubmit = vi.fn();
    mockOnRequestDelete = vi.fn();
    mockOnEditSingle = vi.fn();
    mockOnEditAll = vi.fn();
  });

  const renderComponent = (props = {}) => {
    return render(
      <EditRecurringEventModal
        eventData={mockEventData}
        isShaking={false}
        onChange={mockOnChange}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onRequestDelete={mockOnRequestDelete}
        onEditSingle={mockOnEditSingle}
        onEditAll={mockOnEditAll}
        {...props}
      />
    );
  };

  describe("Choice view", () => {
    it("should render choice view initially", () => {
      renderComponent();

      expect(screen.getByText("modal-recurring-title")).toBeInTheDocument();
      expect(screen.getByText("modal-recurring-prompt")).toBeInTheDocument();
    });

    it("should render cancel, edit single and edit all buttons", () => {
      renderComponent();

      expect(screen.getByText("btn_cancel")).toBeInTheDocument();
      expect(screen.getByText("btn-single")).toBeInTheDocument();
      expect(screen.getByText("btn-all")).toBeInTheDocument();
    });

    it("should call onClose when cancel button is clicked", () => {
      renderComponent();

      fireEvent.click(screen.getByText("btn_cancel"));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should call onEditSingle and switch to edit view when edit single is clicked", () => {
      renderComponent();

      fireEvent.click(screen.getByText("btn-single"));

      expect(mockOnEditSingle).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId("base-event-modal")).toBeInTheDocument();
    });

    it("should call onEditAll and switch to edit view when edit all is clicked", () => {
      renderComponent();

      fireEvent.click(screen.getByText("btn-all"));

      expect(mockOnEditAll).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId("base-event-modal")).toBeInTheDocument();
    });
  });

  describe("Edit view", () => {
    it("should render BaseEventModal after selecting edit single", () => {
      renderComponent();

      fireEvent.click(screen.getByText("btn-single"));

      expect(screen.getByTestId("base-event-modal")).toBeInTheDocument();
      expect(screen.getByText("edit")).toBeInTheDocument();
    });

    it("should render BaseEventModal after selecting edit all", () => {
      renderComponent();

      fireEvent.click(screen.getByText("btn-all"));

      expect(screen.getByTestId("base-event-modal")).toBeInTheDocument();
      expect(screen.getByText("edit")).toBeInTheDocument();
    });

    it("should render delete, cancel and save buttons in edit view", () => {
      renderComponent();

      fireEvent.click(screen.getByText("btn-single"));

      expect(screen.getByText("btn_delete")).toBeInTheDocument();
      expect(screen.getByText("btn_cancel")).toBeInTheDocument();
      expect(screen.getByText("btn_save_changes")).toBeInTheDocument();
    });

    it("should call onRequestDelete when delete button is clicked", () => {
      renderComponent();

      fireEvent.click(screen.getByText("btn-single"));
      fireEvent.click(screen.getByText("btn_delete"));

      expect(mockOnRequestDelete).toHaveBeenCalledTimes(1);
    });

    it("should call onClose when cancel button is clicked in edit view", () => {
      renderComponent();

      fireEvent.click(screen.getByText("btn-single"));
      fireEvent.click(screen.getByText("btn_cancel"));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should not show choice view after switching to edit view", () => {
      renderComponent();

      fireEvent.click(screen.getByText("btn-single"));

      expect(
        screen.queryByText("modal-recurring-title")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("modal-recurring-prompt")
      ).not.toBeInTheDocument();
    });
  });
});

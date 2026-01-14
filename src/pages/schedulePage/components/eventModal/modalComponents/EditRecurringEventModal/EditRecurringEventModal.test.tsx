import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EditRecurringEventModal } from "./EditRecurringEventModal";
import type { Event } from "../../../../../../db/scheduleDb";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../../../../../../components/Confirmation/Confirmation", () => ({
  Confirmation: ({
    variant,
    buttons,
  }: {
    variant: string;
    titleKey: string;
    descKey: string;
    buttons: Array<{
      label: string;
      variant: string;
      onClick: () => void;
    }>;
  }) => (
    <div data-testid={`${variant}-confirmation`}>
      {buttons.map((btn, index) => (
        <button
          key={index}
          onClick={btn.onClick}
          data-testid={`${variant}-btn-${index}`}
        >
          {btn.label}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("../BaseEventModal", () => ({
  BaseEventModal: ({
    title,
    children,
    onSubmit,
  }: {
    title: string;
    children: React.ReactNode;
    onSubmit: (data: unknown) => void;
  }) => (
    <div data-testid="base-event-modal">
      <h3>{title}</h3>
      <form
        data-testid="modal-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ title: "test" });
        }}
      >
        <button type="submit">submit-form</button>
      </form>
      <div>{children}</div>
    </div>
  ),
}));

describe("EditRecurringEventModal", () => {
  let mockEventData: Event;
  let mockOnClose: () => void;
  let mockOnSubmit: () => void;
  let mockOnRequestDelete: () => void;

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

    mockOnClose = vi.fn();
    mockOnSubmit = vi.fn();
    mockOnRequestDelete = vi.fn();
  });

  const renderComponent = (props = {}) => {
    return render(
      <EditRecurringEventModal
        eventData={mockEventData}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onRequestDelete={mockOnRequestDelete}
        {...props}
      />
    );
  };

  describe("Edit confirmation view", () => {
    it("should render edit confirmation initially", () => {
      renderComponent();

      expect(screen.getByTestId("edit-confirmation")).toBeInTheDocument();
    });

    it("should call onClose when cancel is clicked in confirmation", () => {
      renderComponent();

      fireEvent.click(screen.getByTestId("edit-btn-0"));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should switch to edit view when confirm single is clicked", () => {
      renderComponent();

      fireEvent.click(screen.getByTestId("edit-btn-1"));

      expect(screen.getByTestId("base-event-modal")).toBeInTheDocument();
      expect(screen.queryByTestId("edit-confirmation")).not.toBeInTheDocument();
    });

    it("should switch to edit view when confirm all is clicked", () => {
      renderComponent();

      fireEvent.click(screen.getByTestId("edit-btn-2"));

      expect(screen.getByTestId("base-event-modal")).toBeInTheDocument();
      expect(screen.queryByTestId("edit-confirmation")).not.toBeInTheDocument();
    });
  });

  describe("Edit form view", () => {
    it("should render BaseEventModal with correct title after selecting edit option", () => {
      renderComponent();

      fireEvent.click(screen.getByTestId("edit-btn-1"));

      expect(screen.getByTestId("base-event-modal")).toBeInTheDocument();
      expect(screen.getByText("edit_recurring_title")).toBeInTheDocument();
    });

    it("should render delete, cancel and save buttons in edit view", () => {
      renderComponent();

      fireEvent.click(screen.getByTestId("edit-btn-1"));

      expect(screen.getByText("btn_delete")).toBeInTheDocument();
      expect(screen.getByText("btn_cancel")).toBeInTheDocument();
      expect(screen.getByText("btn_save_changes")).toBeInTheDocument();
    });

    it("should call onClose when cancel button is clicked in edit view", () => {
      renderComponent();

      fireEvent.click(screen.getByTestId("edit-btn-1"));
      fireEvent.click(screen.getByText("btn_cancel"));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should call onSubmit with isEditAll false when editing single", () => {
      renderComponent();

      fireEvent.click(screen.getByTestId("edit-btn-1"));
      fireEvent.click(screen.getByText("submit-form"));

      expect(mockOnSubmit).toHaveBeenCalledWith(
        { title: "test" },
        { isEditAll: false }
      );
    });

    it("should call onSubmit with isEditAll true when editing all", () => {
      renderComponent();

      fireEvent.click(screen.getByTestId("edit-btn-2"));
      fireEvent.click(screen.getByText("submit-form"));

      expect(mockOnSubmit).toHaveBeenCalledWith(
        { title: "test" },
        { isEditAll: true }
      );
    });
  });

  describe("Delete confirmation", () => {
    it("should open delete confirmation when delete button is clicked", () => {
      renderComponent();

      fireEvent.click(screen.getByTestId("edit-btn-1"));
      fireEvent.click(screen.getByText("btn_delete"));

      expect(screen.getByTestId("delete-confirmation")).toBeInTheDocument();
    });

    it("should close delete confirmation when cancel is clicked", () => {
      renderComponent();

      fireEvent.click(screen.getByTestId("edit-btn-1"));
      fireEvent.click(screen.getByText("btn_delete"));
      fireEvent.click(screen.getByTestId("delete-btn-0"));

      expect(
        screen.queryByTestId("delete-confirmation")
      ).not.toBeInTheDocument();
    });

    it("should call onRequestDelete with isDeleteAll false when deleting single", () => {
      renderComponent();

      fireEvent.click(screen.getByTestId("edit-btn-1"));
      fireEvent.click(screen.getByText("btn_delete"));
      fireEvent.click(screen.getByTestId("delete-btn-1"));

      expect(mockOnRequestDelete).toHaveBeenCalledWith({ isDeleteAll: false });
    });

    it("should call onRequestDelete with isDeleteAll true when deleting all", () => {
      renderComponent();

      fireEvent.click(screen.getByTestId("edit-btn-1"));
      fireEvent.click(screen.getByText("btn_delete"));
      fireEvent.click(screen.getByTestId("delete-btn-2"));

      expect(mockOnRequestDelete).toHaveBeenCalledWith({ isDeleteAll: true });
    });

    it("should not show delete confirmation initially in edit view", () => {
      renderComponent();

      fireEvent.click(screen.getByTestId("edit-btn-1"));

      expect(
        screen.queryByTestId("delete-confirmation")
      ).not.toBeInTheDocument();
    });
  });
});

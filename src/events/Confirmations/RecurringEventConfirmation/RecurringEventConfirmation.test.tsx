import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RecurringEventConfirmation } from "./RecurringEventConfirmation";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../../../components/Confirmation/Confirmation", () => ({
  Confirmation: ({
    variant,
    titleKey,
    descKey,
    buttons,
  }: {
    variant: string;
    titleKey: string;
    descKey: string;
    buttons: Array<{
      label: string;
      icon: string;
      variant: string;
      onClick: () => void;
    }>;
  }) => (
    <div data-testid={`confirmation-${variant}`}>
      <span data-testid="title">{titleKey}</span>
      <span data-testid="desc">{descKey}</span>
      {buttons.map((btn, index) => (
        <button
          key={index}
          onClick={btn.onClick}
          data-testid={`btn-${btn.label}`}
          data-variant={btn.variant}
        >
          {btn.icon && <i className={btn.icon}></i>}
          {btn.label}
        </button>
      ))}
    </div>
  ),
}));

describe("RecurringEventConfirmation", () => {
  const mockOnClose = vi.fn();
  const mockOnConfirmSingle = vi.fn();
  const mockOnConfirmAll = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("edit variant", () => {
    it("should render with edit variant", () => {
      render(
        <RecurringEventConfirmation
          variant="edit"
          onClose={mockOnClose}
          onConfirmSingle={mockOnConfirmSingle}
          onConfirmAll={mockOnConfirmAll}
        />
      );

      expect(screen.getByTestId("confirmation-edit")).toBeInTheDocument();
    });

    it("should display correct title for edit", () => {
      render(
        <RecurringEventConfirmation
          variant="edit"
          onClose={mockOnClose}
          onConfirmSingle={mockOnConfirmSingle}
          onConfirmAll={mockOnConfirmAll}
        />
      );

      expect(screen.getByTestId("title")).toHaveTextContent(
        "modal-recurring-title"
      );
    });

    it("should display correct description for edit", () => {
      render(
        <RecurringEventConfirmation
          variant="edit"
          onClose={mockOnClose}
          onConfirmSingle={mockOnConfirmSingle}
          onConfirmAll={mockOnConfirmAll}
        />
      );

      expect(screen.getByTestId("desc")).toHaveTextContent(
        "modal-recurring-prompt"
      );
    });

    it("should render buttons with primary variant for edit", () => {
      render(
        <RecurringEventConfirmation
          variant="edit"
          onClose={mockOnClose}
          onConfirmSingle={mockOnConfirmSingle}
          onConfirmAll={mockOnConfirmAll}
        />
      );

      expect(screen.getByTestId("btn-btn-single")).toHaveAttribute(
        "data-variant",
        "primary"
      );
      expect(screen.getByTestId("btn-btn-all")).toHaveAttribute(
        "data-variant",
        "primary"
      );
    });
  });

  describe("delete variant", () => {
    it("should render with delete variant", () => {
      render(
        <RecurringEventConfirmation
          variant="delete"
          onClose={mockOnClose}
          onConfirmSingle={mockOnConfirmSingle}
          onConfirmAll={mockOnConfirmAll}
        />
      );

      expect(screen.getByTestId("confirmation-delete")).toBeInTheDocument();
    });

    it("should display correct title for delete", () => {
      render(
        <RecurringEventConfirmation
          variant="delete"
          onClose={mockOnClose}
          onConfirmSingle={mockOnConfirmSingle}
          onConfirmAll={mockOnConfirmAll}
        />
      );

      expect(screen.getByTestId("title")).toHaveTextContent(
        "delete-recurring-event-title"
      );
    });

    it("should render buttons with danger variant for delete", () => {
      render(
        <RecurringEventConfirmation
          variant="delete"
          onClose={mockOnClose}
          onConfirmSingle={mockOnConfirmSingle}
          onConfirmAll={mockOnConfirmAll}
        />
      );

      expect(screen.getByTestId("btn-btn-single")).toHaveAttribute(
        "data-variant",
        "danger"
      );
      expect(screen.getByTestId("btn-btn-all")).toHaveAttribute(
        "data-variant",
        "danger"
      );
    });
  });

  describe("button interactions", () => {
    it("should call onClose when cancel button is clicked", () => {
      render(
        <RecurringEventConfirmation
          variant="edit"
          onClose={mockOnClose}
          onConfirmSingle={mockOnConfirmSingle}
          onConfirmAll={mockOnConfirmAll}
        />
      );

      fireEvent.click(screen.getByTestId("btn-btn_cancel"));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should call onConfirmSingle when single button is clicked", () => {
      render(
        <RecurringEventConfirmation
          variant="edit"
          onClose={mockOnClose}
          onConfirmSingle={mockOnConfirmSingle}
          onConfirmAll={mockOnConfirmAll}
        />
      );

      fireEvent.click(screen.getByTestId("btn-btn-single"));
      expect(mockOnConfirmSingle).toHaveBeenCalledTimes(1);
    });

    it("should call onConfirmAll when all button is clicked", () => {
      render(
        <RecurringEventConfirmation
          variant="edit"
          onClose={mockOnClose}
          onConfirmSingle={mockOnConfirmSingle}
          onConfirmAll={mockOnConfirmAll}
        />
      );

      fireEvent.click(screen.getByTestId("btn-btn-all"));
      expect(mockOnConfirmAll).toHaveBeenCalledTimes(1);
    });

    it("should render all three buttons", () => {
      render(
        <RecurringEventConfirmation
          variant="delete"
          onClose={mockOnClose}
          onConfirmSingle={mockOnConfirmSingle}
          onConfirmAll={mockOnConfirmAll}
        />
      );

      expect(screen.getByTestId("btn-btn_cancel")).toBeInTheDocument();
      expect(screen.getByTestId("btn-btn-single")).toBeInTheDocument();
      expect(screen.getByTestId("btn-btn-all")).toBeInTheDocument();
    });
  });
});

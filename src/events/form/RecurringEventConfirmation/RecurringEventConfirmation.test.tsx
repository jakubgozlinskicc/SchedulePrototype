import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RecurringEventConfirmation } from "./RecurringEventConfirmation";
import { variantConfig } from "./RecurringEventConfirmation.types";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../../../components/Modal/Modal", () => ({
  Modal: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="modal" className={className}>
      {children}
    </div>
  ),
}));

vi.mock("../../../components/Button/Button", () => ({
  Button: ({
    children,
    onClick,
    variant,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    variant: string;
  }) => (
    <button onClick={onClick} data-variant={variant}>
      {children}
    </button>
  ),
}));

describe("RecurringEventConfirmation", () => {
  let mockOnClose: () => void;
  let mockOnConfirmSingle: () => void;
  let mockOnConfirmAll: () => void;

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnClose = vi.fn();
    mockOnConfirmSingle = vi.fn();
    mockOnConfirmAll = vi.fn();
  });

  describe("edit variant", () => {
    const renderEditVariant = () =>
      render(
        <RecurringEventConfirmation
          variant="edit"
          onClose={mockOnClose}
          onConfirmSingle={mockOnConfirmSingle}
          onConfirmAll={mockOnConfirmAll}
        />
      );

    it("should render modal with edit class", () => {
      renderEditVariant();

      const modal = screen.getByTestId("modal");
      expect(modal.className).toContain("edit");
    });

    it("should render edit icon", () => {
      const { container } = renderEditVariant();

      const icon = container.querySelector(".fa-pen-to-square");
      expect(icon).toBeInTheDocument();
    });

    it("should render edit title translation key", () => {
      renderEditVariant();

      expect(screen.getByText("modal-recurring-title")).toBeInTheDocument();
    });

    it("should render edit description translation key", () => {
      renderEditVariant();

      expect(screen.getByText("modal-recurring-prompt")).toBeInTheDocument();
    });

    it("should render buttons with primary variant", () => {
      renderEditVariant();

      const buttons = screen.getAllByRole("button");
      const primaryButtons = buttons.filter(
        (btn) => btn.getAttribute("data-variant") === "primary"
      );

      expect(primaryButtons).toHaveLength(2);
    });
  });

  describe("delete variant", () => {
    const renderDeleteVariant = () =>
      render(
        <RecurringEventConfirmation
          variant="delete"
          onClose={mockOnClose}
          onConfirmSingle={mockOnConfirmSingle}
          onConfirmAll={mockOnConfirmAll}
        />
      );

    it("should render modal with delete class", () => {
      renderDeleteVariant();

      const modal = screen.getByTestId("modal");
      expect(modal.className).toContain("delete");
    });

    it("should render exclamation icon", () => {
      const { container } = renderDeleteVariant();

      const icon = container.querySelector(".fa-circle-exclamation");
      expect(icon).toBeInTheDocument();
    });

    it("should render delete title translation key", () => {
      renderDeleteVariant();

      expect(
        screen.getByText("delete-recurring-event-title")
      ).toBeInTheDocument();
    });

    it("should render delete description translation key", () => {
      renderDeleteVariant();

      expect(
        screen.getByText("delete-recurring-event-desc")
      ).toBeInTheDocument();
    });

    it("should render buttons with danger variant", () => {
      renderDeleteVariant();

      const buttons = screen.getAllByRole("button");
      const dangerButtons = buttons.filter(
        (btn) => btn.getAttribute("data-variant") === "danger"
      );

      expect(dangerButtons).toHaveLength(2);
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

      fireEvent.click(screen.getByText("btn_cancel"));

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

      fireEvent.click(screen.getByText("btn-single"));

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

      fireEvent.click(screen.getByText("btn-all"));

      expect(mockOnConfirmAll).toHaveBeenCalledTimes(1);
    });

    it("should not call other handlers when cancel is clicked", () => {
      render(
        <RecurringEventConfirmation
          variant="edit"
          onClose={mockOnClose}
          onConfirmSingle={mockOnConfirmSingle}
          onConfirmAll={mockOnConfirmAll}
        />
      );

      fireEvent.click(screen.getByText("btn_cancel"));

      expect(mockOnConfirmSingle).not.toHaveBeenCalled();
      expect(mockOnConfirmAll).not.toHaveBeenCalled();
    });
  });

  describe("button icons", () => {
    it("should render xmark icon in cancel button", () => {
      const { container } = render(
        <RecurringEventConfirmation
          variant="edit"
          onClose={mockOnClose}
          onConfirmSingle={mockOnConfirmSingle}
          onConfirmAll={mockOnConfirmAll}
        />
      );

      const icon = container.querySelector(".fa-xmark");
      expect(icon).toBeInTheDocument();
    });

    it("should render calendar-day icon in single button", () => {
      const { container } = render(
        <RecurringEventConfirmation
          variant="edit"
          onClose={mockOnClose}
          onConfirmSingle={mockOnConfirmSingle}
          onConfirmAll={mockOnConfirmAll}
        />
      );

      const icons = container.querySelectorAll(".fa-calendar-day");
      expect(icons.length).toBeGreaterThan(0);
    });

    it("should render calendar-days icon in all button", () => {
      const { container } = render(
        <RecurringEventConfirmation
          variant="edit"
          onClose={mockOnClose}
          onConfirmSingle={mockOnConfirmSingle}
          onConfirmAll={mockOnConfirmAll}
        />
      );

      const icons = container.querySelectorAll(".fa-calendar-days");
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe("all buttons rendered", () => {
    it("should render exactly three buttons", () => {
      render(
        <RecurringEventConfirmation
          variant="edit"
          onClose={mockOnClose}
          onConfirmSingle={mockOnConfirmSingle}
          onConfirmAll={mockOnConfirmAll}
        />
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(3);
    });

    it("should render cancel button with secondary variant", () => {
      render(
        <RecurringEventConfirmation
          variant="edit"
          onClose={mockOnClose}
          onConfirmSingle={mockOnConfirmSingle}
          onConfirmAll={mockOnConfirmAll}
        />
      );

      const cancelButton = screen.getByText("btn_cancel").closest("button");
      expect(cancelButton).toHaveAttribute("data-variant", "secondary");
    });
  });
});

describe("variantConfig", () => {
  it("should have edit config with correct values", () => {
    expect(variantConfig.edit).toEqual({
      icon: "fa-solid fa-pen-to-square",
      titleKey: "modal-recurring-title",
      descKey: "modal-recurring-prompt",
      buttonVariant: "primary",
      singleIcon: "fa-solid fa-calendar-day",
      allIcon: "fa-solid fa-calendar-days",
    });
  });

  it("should have delete config with correct values", () => {
    expect(variantConfig.delete).toEqual({
      icon: "fa-solid fa-circle-exclamation",
      titleKey: "delete-recurring-event-title",
      descKey: "delete-recurring-event-desc",
      buttonVariant: "danger",
      singleIcon: "fa-solid fa-calendar-day",
      allIcon: "fa-solid fa-calendar-days",
    });
  });
});

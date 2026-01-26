import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RegularEventConfirmation } from "./RegularEventConfirmation";

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

describe("RegularEventConfirmation", () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("delete variant", () => {
    it("should render with delete variant", () => {
      render(
        <RegularEventConfirmation
          variant="delete"
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      expect(screen.getByTestId("confirmation-delete")).toBeInTheDocument();
    });

    it("should display correct title for delete", () => {
      render(
        <RegularEventConfirmation
          variant="delete"
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      expect(screen.getByTestId("title")).toHaveTextContent(
        "delete-event-title"
      );
    });

    it("should display correct description for delete", () => {
      render(
        <RegularEventConfirmation
          variant="delete"
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      expect(screen.getByTestId("desc")).toHaveTextContent("delete-event-desc");
    });

    it("should render cancel button", () => {
      render(
        <RegularEventConfirmation
          variant="delete"
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      const cancelBtn = screen.getByTestId("btn-btn_cancel");
      expect(cancelBtn).toBeInTheDocument();
      expect(cancelBtn).toHaveAttribute("data-variant", "secondary");
    });

    it("should render delete confirm button", () => {
      render(
        <RegularEventConfirmation
          variant="delete"
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      const deleteBtn = screen.getByTestId("btn-btn_delete");
      expect(deleteBtn).toBeInTheDocument();
      expect(deleteBtn).toHaveAttribute("data-variant", "danger");
    });

    it("should call onClose when cancel button is clicked", () => {
      render(
        <RegularEventConfirmation
          variant="delete"
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      fireEvent.click(screen.getByTestId("btn-btn_cancel"));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should call onConfirm when delete button is clicked", () => {
      render(
        <RegularEventConfirmation
          variant="delete"
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      fireEvent.click(screen.getByTestId("btn-btn_delete"));
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });
  });
});

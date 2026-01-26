import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Confirmation } from "./Confirmation";
import { variantDefaults, type ConfirmationButton } from "./Confirmation.types";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../Modal/Modal", () => ({
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

vi.mock("../Button/Button", () => ({
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

describe("Confirmation", () => {
  let mockOnClick1: () => void;
  let mockOnClick2: () => void;
  let mockOnClick3: () => void;

  const defaultButtons: ConfirmationButton[] = [
    {
      label: "btn_cancel",
      icon: "fa-solid fa-xmark",
      variant: "secondary",
      onClick: vi.fn(),
    },
    {
      label: "btn-single",
      icon: "fa-solid fa-calendar-day",
      variant: "primary",
      onClick: vi.fn(),
    },
    {
      label: "btn-all",
      icon: "fa-solid fa-calendar-days",
      variant: "primary",
      onClick: vi.fn(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnClick1 = vi.fn();
    mockOnClick2 = vi.fn();
    mockOnClick3 = vi.fn();
  });

  describe("edit variant", () => {
    const renderEditVariant = (props = {}) =>
      render(
        <Confirmation
          variant="edit"
          titleKey="modal-recurring-title"
          descKey="modal-recurring-prompt"
          buttons={[
            { ...defaultButtons[0], onClick: mockOnClick1 },
            { ...defaultButtons[1], onClick: mockOnClick2 },
            { ...defaultButtons[2], onClick: mockOnClick3 },
          ]}
          {...props}
        />
      );

    it("should render modal with edit class", () => {
      renderEditVariant();

      const modal = screen.getByTestId("modal");
      expect(modal.className).toContain("edit");
    });

    it("should render default edit icon when no custom icon provided", () => {
      const { container } = renderEditVariant();

      const icon = container.querySelector(".fa-pen-to-square");
      expect(icon).toBeInTheDocument();
    });

    it("should render custom icon when provided", () => {
      const { container } = renderEditVariant({
        icon: "fa-solid fa-custom-icon",
      });

      const icon = container.querySelector(".fa-custom-icon");
      expect(icon).toBeInTheDocument();
    });

    it("should render title translation key", () => {
      renderEditVariant();

      expect(screen.getByText("modal-recurring-title")).toBeInTheDocument();
    });

    it("should render description translation key", () => {
      renderEditVariant();

      expect(screen.getByText("modal-recurring-prompt")).toBeInTheDocument();
    });

    it("should render buttons with correct variants", () => {
      renderEditVariant();

      const buttons = screen.getAllByRole("button");
      const primaryButtons = buttons.filter(
        (btn) => btn.getAttribute("data-variant") === "primary"
      );
      const secondaryButtons = buttons.filter(
        (btn) => btn.getAttribute("data-variant") === "secondary"
      );

      expect(primaryButtons).toHaveLength(2);
      expect(secondaryButtons).toHaveLength(1);
    });
  });

  describe("delete variant", () => {
    const renderDeleteVariant = (props = {}) =>
      render(
        <Confirmation
          variant="delete"
          titleKey="delete-recurring-event-title"
          descKey="delete-recurring-event-desc"
          buttons={[
            { ...defaultButtons[0], onClick: mockOnClick1 },
            {
              ...defaultButtons[1],
              variant: "danger",
              onClick: mockOnClick2,
            },
            {
              ...defaultButtons[2],
              variant: "danger",
              onClick: mockOnClick3,
            },
          ]}
          {...props}
        />
      );

    it("should render modal with delete class", () => {
      renderDeleteVariant();

      const modal = screen.getByTestId("modal");
      expect(modal.className).toContain("delete");
    });

    it("should render default delete icon (exclamation)", () => {
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
    it("should call first button onClick when clicked", () => {
      render(
        <Confirmation
          variant="edit"
          titleKey="test-title"
          descKey="test-desc"
          buttons={[
            {
              label: "btn_cancel",
              icon: "fa-solid fa-xmark",
              variant: "secondary",
              onClick: mockOnClick1,
            },
            {
              label: "btn-single",
              variant: "primary",
              onClick: mockOnClick2,
            },
          ]}
        />
      );

      fireEvent.click(screen.getByText("btn_cancel"));

      expect(mockOnClick1).toHaveBeenCalledTimes(1);
    });

    it("should call second button onClick when clicked", () => {
      render(
        <Confirmation
          variant="edit"
          titleKey="test-title"
          descKey="test-desc"
          buttons={[
            {
              label: "btn_cancel",
              variant: "secondary",
              onClick: mockOnClick1,
            },
            {
              label: "btn-single",
              variant: "primary",
              onClick: mockOnClick2,
            },
          ]}
        />
      );

      fireEvent.click(screen.getByText("btn-single"));

      expect(mockOnClick2).toHaveBeenCalledTimes(1);
    });

    it("should call third button onClick when clicked", () => {
      render(
        <Confirmation
          variant="edit"
          titleKey="test-title"
          descKey="test-desc"
          buttons={[
            {
              label: "btn_cancel",
              variant: "secondary",
              onClick: mockOnClick1,
            },
            {
              label: "btn-single",
              variant: "primary",
              onClick: mockOnClick2,
            },
            {
              label: "btn-all",
              variant: "primary",
              onClick: mockOnClick3,
            },
          ]}
        />
      );

      fireEvent.click(screen.getByText("btn-all"));

      expect(mockOnClick3).toHaveBeenCalledTimes(1);
    });

    it("should not call other handlers when one button is clicked", () => {
      render(
        <Confirmation
          variant="edit"
          titleKey="test-title"
          descKey="test-desc"
          buttons={[
            {
              label: "btn_cancel",
              variant: "secondary",
              onClick: mockOnClick1,
            },
            {
              label: "btn-single",
              variant: "primary",
              onClick: mockOnClick2,
            },
            {
              label: "btn-all",
              variant: "primary",
              onClick: mockOnClick3,
            },
          ]}
        />
      );

      fireEvent.click(screen.getByText("btn_cancel"));

      expect(mockOnClick2).not.toHaveBeenCalled();
      expect(mockOnClick3).not.toHaveBeenCalled();
    });
  });

  describe("button icons", () => {
    it("should render button icons when provided", () => {
      const { container } = render(
        <Confirmation
          variant="edit"
          titleKey="test-title"
          descKey="test-desc"
          buttons={[
            {
              label: "btn_cancel",
              icon: "fa-solid fa-xmark",
              variant: "secondary",
              onClick: mockOnClick1,
            },
            {
              label: "btn-single",
              icon: "fa-solid fa-calendar-day",
              variant: "primary",
              onClick: mockOnClick2,
            },
            {
              label: "btn-all",
              icon: "fa-solid fa-calendar-days",
              variant: "primary",
              onClick: mockOnClick3,
            },
          ]}
        />
      );

      expect(container.querySelector(".fa-xmark")).toBeInTheDocument();
      expect(container.querySelector(".fa-calendar-day")).toBeInTheDocument();
      expect(container.querySelector(".fa-calendar-days")).toBeInTheDocument();
    });

    it("should not render icon element when icon is not provided", () => {
      render(
        <Confirmation
          variant="edit"
          titleKey="test-title"
          descKey="test-desc"
          buttons={[
            {
              label: "btn_cancel",
              variant: "secondary",
              onClick: mockOnClick1,
            },
          ]}
        />
      );

      const button = screen.getByText("btn_cancel").closest("button");
      const iconInButton = button?.querySelector("i");

      expect(iconInButton).not.toBeInTheDocument();
    });
  });

  describe("buttons count", () => {
    it("should render correct number of buttons", () => {
      render(
        <Confirmation
          variant="edit"
          titleKey="test-title"
          descKey="test-desc"
          buttons={[
            {
              label: "btn_cancel",
              variant: "secondary",
              onClick: mockOnClick1,
            },
            {
              label: "btn-single",
              variant: "primary",
              onClick: mockOnClick2,
            },
            {
              label: "btn-all",
              variant: "primary",
              onClick: mockOnClick3,
            },
          ]}
        />
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(3);
    });

    it("should render single button when only one provided", () => {
      render(
        <Confirmation
          variant="edit"
          titleKey="test-title"
          descKey="test-desc"
          buttons={[
            {
              label: "btn_ok",
              variant: "primary",
              onClick: mockOnClick1,
            },
          ]}
        />
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(1);
    });

    it("should render two buttons when two provided", () => {
      render(
        <Confirmation
          variant="delete"
          titleKey="test-title"
          descKey="test-desc"
          buttons={[
            {
              label: "btn_cancel",
              variant: "secondary",
              onClick: mockOnClick1,
            },
            {
              label: "btn_confirm",
              variant: "danger",
              onClick: mockOnClick2,
            },
          ]}
        />
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
    });
  });

  describe("custom title and description", () => {
    it("should render custom title key", () => {
      render(
        <Confirmation
          variant="edit"
          titleKey="custom-title-key"
          descKey="test-desc"
          buttons={[
            {
              label: "btn_ok",
              variant: "primary",
              onClick: mockOnClick1,
            },
          ]}
        />
      );

      expect(screen.getByText("custom-title-key")).toBeInTheDocument();
    });

    it("should render custom description key", () => {
      render(
        <Confirmation
          variant="edit"
          titleKey="test-title"
          descKey="custom-desc-key"
          buttons={[
            {
              label: "btn_ok",
              variant: "primary",
              onClick: mockOnClick1,
            },
          ]}
        />
      );

      expect(screen.getByText("custom-desc-key")).toBeInTheDocument();
    });
  });
});

describe("variantDefaults", () => {
  it("should have edit config with correct icon", () => {
    expect(variantDefaults.edit).toEqual({
      icon: "fa-regular fa-pen-to-square",
    });
  });

  it("should have delete config with correct icon", () => {
    expect(variantDefaults.delete).toEqual({
      icon: "fa-solid fa-circle-exclamation",
    });
  });
});

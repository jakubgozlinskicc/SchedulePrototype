import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DeleteEventConfirmation } from "./DeleteEventConfirmation";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../../../components/Button/Button", () => ({
  Button: ({ children, onClick, variant }: any) => (
    <button data-testid={`button-${variant}`} onClick={onClick}>
      {children}
    </button>
  ),
}));

describe("DeleteEventConfirmation", () => {
  it("should render modal with title and description", () => {
    const mockOnClose = vi.fn();
    const mockOnConfirmSingle = vi.fn();
    const mockOnConfirmAll = vi.fn();

    render(
      <DeleteEventConfirmation
        onClose={mockOnClose}
        onConfirmSingle={mockOnConfirmSingle}
        onConfirmAll={mockOnConfirmAll}
      />
    );

    expect(
      screen.getByText("delete-recurring-event-title")
    ).toBeInTheDocument();
    expect(screen.getByText("delete-recurring-event-desc")).toBeInTheDocument();
  });

  it("should render warning icon", () => {
    const mockOnClose = vi.fn();
    const mockOnConfirmSingle = vi.fn();
    const mockOnConfirmAll = vi.fn();

    const { container } = render(
      <DeleteEventConfirmation
        onClose={mockOnClose}
        onConfirmSingle={mockOnConfirmSingle}
        onConfirmAll={mockOnConfirmAll}
      />
    );

    expect(
      container.querySelector(".fa-circle-exclamation")
    ).toBeInTheDocument();
  });

  it("should render all three buttons", () => {
    const mockOnClose = vi.fn();
    const mockOnConfirmSingle = vi.fn();
    const mockOnConfirmAll = vi.fn();

    render(
      <DeleteEventConfirmation
        onClose={mockOnClose}
        onConfirmSingle={mockOnConfirmSingle}
        onConfirmAll={mockOnConfirmAll}
      />
    );

    expect(screen.getByTestId("button-secondary")).toBeInTheDocument();
    expect(screen.getAllByTestId("button-danger")).toHaveLength(2);
  });

  it("should call onClose when cancel button is clicked", () => {
    const mockOnClose = vi.fn();
    const mockOnConfirmSingle = vi.fn();
    const mockOnConfirmAll = vi.fn();

    render(
      <DeleteEventConfirmation
        onClose={mockOnClose}
        onConfirmSingle={mockOnConfirmSingle}
        onConfirmAll={mockOnConfirmAll}
      />
    );

    fireEvent.click(screen.getByTestId("button-secondary"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should call onConfirmSingle when single button is clicked", () => {
    const mockOnClose = vi.fn();
    const mockOnConfirmSingle = vi.fn();
    const mockOnConfirmAll = vi.fn();

    render(
      <DeleteEventConfirmation
        onClose={mockOnClose}
        onConfirmSingle={mockOnConfirmSingle}
        onConfirmAll={mockOnConfirmAll}
      />
    );

    const dangerButtons = screen.getAllByTestId("button-danger");
    fireEvent.click(dangerButtons[0]);
    expect(mockOnConfirmSingle).toHaveBeenCalledTimes(1);
  });

  it("should call onConfirmAll when all button is clicked", () => {
    const mockOnClose = vi.fn();
    const mockOnConfirmSingle = vi.fn();
    const mockOnConfirmAll = vi.fn();

    render(
      <DeleteEventConfirmation
        onClose={mockOnClose}
        onConfirmSingle={mockOnConfirmSingle}
        onConfirmAll={mockOnConfirmAll}
      />
    );

    const dangerButtons = screen.getAllByTestId("button-danger");
    fireEvent.click(dangerButtons[1]);
    expect(mockOnConfirmAll).toHaveBeenCalledTimes(1);
  });

  it("should render button labels", () => {
    const mockOnClose = vi.fn();
    const mockOnConfirmSingle = vi.fn();
    const mockOnConfirmAll = vi.fn();

    render(
      <DeleteEventConfirmation
        onClose={mockOnClose}
        onConfirmSingle={mockOnConfirmSingle}
        onConfirmAll={mockOnConfirmAll}
      />
    );

    expect(screen.getByText("btn_cancel")).toBeInTheDocument();
    expect(screen.getByText("btn-single")).toBeInTheDocument();
    expect(screen.getByText("btn-all")).toBeInTheDocument();
  });
});

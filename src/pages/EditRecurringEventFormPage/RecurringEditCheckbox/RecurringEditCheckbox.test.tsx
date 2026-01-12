import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RecurringEditCheckbox } from "./RecurringEditCheckbox";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("RecurringEditCheckbox", () => {
  it("should render checkbox with label", () => {
    const mockOnChange = vi.fn();
    render(<RecurringEditCheckbox isEditAll={false} onChange={mockOnChange} />);

    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByText("edit-all-ocurrences")).toBeInTheDocument();
  });

  it("should be unchecked when isEditAll is false", () => {
    const mockOnChange = vi.fn();
    render(<RecurringEditCheckbox isEditAll={false} onChange={mockOnChange} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("should be checked when isEditAll is true", () => {
    const mockOnChange = vi.fn();
    render(<RecurringEditCheckbox isEditAll={true} onChange={mockOnChange} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("should call onChange when checkbox is clicked", () => {
    const mockOnChange = vi.fn();
    render(<RecurringEditCheckbox isEditAll={false} onChange={mockOnChange} />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("should have correct class names", () => {
    const mockOnChange = vi.fn();
    const { container } = render(
      <RecurringEditCheckbox isEditAll={false} onChange={mockOnChange} />
    );

    expect(container.querySelector(".checkbox")).toBeInTheDocument();
    expect(container.querySelector(".checkbox-label")).toBeInTheDocument();
    expect(container.querySelector(".checkbox-text")).toBeInTheDocument();
  });
});

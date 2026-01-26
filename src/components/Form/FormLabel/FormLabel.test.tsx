import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormLabel } from "./FormLabel";

describe("FormLabel", () => {
  it("should render children", () => {
    render(<FormLabel>Test Label</FormLabel>);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("should render as label element", () => {
    render(<FormLabel>Label</FormLabel>);

    const label = screen.getByText("Label");
    expect(label.tagName).toBe("LABEL");
  });

  it("should pass htmlFor attribute", () => {
    render(<FormLabel htmlFor="test-input">Label</FormLabel>);

    const label = screen.getByText("Label");
    expect(label).toHaveAttribute("for", "test-input");
  });

  it("should render with icon as child", () => {
    const { container } = render(
      <FormLabel>
        <i className="fa-solid fa-star"></i>
        Label with icon
      </FormLabel>
    );

    expect(screen.getByText("Label with icon")).toBeInTheDocument();
    expect(container.querySelector(".fa-star")).toBeInTheDocument();
  });

  it("should pass additional props", () => {
    render(
      <FormLabel data-testid="custom-label" id="my-label">
        Label
      </FormLabel>
    );

    const label = screen.getByTestId("custom-label");
    expect(label).toHaveAttribute("id", "my-label");
  });
});

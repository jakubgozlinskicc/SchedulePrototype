import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormField } from "./FormField";

describe("FormField", () => {
  it("should render children", () => {
    render(
      <FormField>
        <span>Test content</span>
      </FormField>
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("should render multiple children", () => {
    render(
      <FormField>
        <label>Label</label>
        <input data-testid="input" />
      </FormField>
    );

    expect(screen.getByText("Label")).toBeInTheDocument();
    expect(screen.getByTestId("input")).toBeInTheDocument();
  });

  it("should render nested elements", () => {
    render(
      <FormField>
        <div>
          <span>Nested content</span>
        </div>
      </FormField>
    );

    expect(screen.getByText("Nested content")).toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createRef } from "react";
import { Button } from "./Button";
import styles from "./Button.module.css";

describe("Button", () => {
  it("should render button element", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  describe("variants", () => {
    it("should apply primary variant by default", () => {
      render(<Button>Primary</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass(styles.button);
      expect(button).toHaveClass(styles.primary);
    });

    it("should apply secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass(styles.secondary);
    });

    it("should apply danger variant", () => {
      render(<Button variant="danger">Danger</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass(styles.danger);
    });
  });

  describe("isActive", () => {
    it("should not apply active class by default", () => {
      render(<Button>Button</Button>);

      const button = screen.getByRole("button");
      expect(button).not.toHaveClass(styles.active);
    });

    it("should apply active class when isActive is true", () => {
      render(<Button isActive>Active Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass(styles.active);
    });
  });

  describe("className", () => {
    it("should apply custom className", () => {
      render(<Button className="custom-class">Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass(styles.button);
      expect(button).toHaveClass("custom-class");
    });

    it("should combine multiple classes correctly", () => {
      render(
        <Button variant="danger" isActive className="custom-class">
          Button
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass(styles.button);
      expect(button).toHaveClass(styles.danger);
      expect(button).toHaveClass(styles.active);
      expect(button).toHaveClass("custom-class");
    });
  });

  describe("events", () => {
    it("should call onClick handler when clicked", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onClick when disabled", () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Click
        </Button>
      );

      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("HTML attributes", () => {
    it("should pass type attribute", () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    it("should be disabled when disabled prop is passed", () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("should pass aria attributes", () => {
      render(<Button aria-label="Custom label">Button</Button>);
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "Custom label"
      );
    });

    it("should pass data attributes", () => {
      render(<Button data-testid="custom-button">Button</Button>);
      expect(screen.getByTestId("custom-button")).toBeInTheDocument();
    });
  });

  describe("forwardRef", () => {
    it("should forward ref to button element", () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Button</Button>);

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current?.tagName).toBe("BUTTON");
    });

    it("should allow ref to be used for focus", () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Button</Button>);

      ref.current?.focus();
      expect(document.activeElement).toBe(ref.current);
    });
  });

  describe("displayName", () => {
    it("should have correct displayName", () => {
      expect(Button.displayName).toBe("Button");
    });
  });
});

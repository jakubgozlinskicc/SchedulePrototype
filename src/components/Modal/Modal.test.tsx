import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Modal } from "./Modal";

describe("Modal", () => {
  describe("rendering", () => {
    it("should render children", () => {
      render(
        <Modal>
          <div data-testid="child">Test Content</div>
        </Modal>
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should render backdrop element", () => {
      const { container } = render(
        <Modal>
          <div>Content</div>
        </Modal>
      );

      const backdrop = container.querySelector('[class*="backdrop"]');
      expect(backdrop).toBeInTheDocument();
    });

    it("should render modal container element", () => {
      const { container } = render(
        <Modal>
          <div>Content</div>
        </Modal>
      );

      const modal = container.querySelector('[class*="modal"]');
      expect(modal).toBeInTheDocument();
    });

    it("should render multiple children", () => {
      render(
        <Modal>
          <div data-testid="child1">First</div>
          <div data-testid="child2">Second</div>
          <div data-testid="child3">Third</div>
        </Modal>
      );

      expect(screen.getByTestId("child1")).toBeInTheDocument();
      expect(screen.getByTestId("child2")).toBeInTheDocument();
      expect(screen.getByTestId("child3")).toBeInTheDocument();
    });

    it("should render complex nested children", () => {
      render(
        <Modal>
          <header>Header</header>
          <main>
            <p>Paragraph content</p>
            <button>Click me</button>
          </main>
          <footer>Footer</footer>
        </Modal>
      );

      expect(screen.getByText("Header")).toBeInTheDocument();
      expect(screen.getByText("Paragraph content")).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByText("Footer")).toBeInTheDocument();
    });
  });

  describe("className prop", () => {
    it("should apply custom className to modal", () => {
      const { container } = render(
        <Modal className="custom-class">
          <div>Content</div>
        </Modal>
      );

      const modal = container.querySelector('[class*="modal"]');
      expect(modal?.className).toContain("custom-class");
    });

    it("should handle undefined className gracefully", () => {
      const { container } = render(
        <Modal>
          <div>Content</div>
        </Modal>
      );

      const modal = container.querySelector('[class*="modal"]');
      expect(modal?.className).not.toContain("undefined");
    });

    it("should preserve base modal class when adding custom class", () => {
      const { container } = render(
        <Modal className="custom-class">
          <div>Content</div>
        </Modal>
      );

      const modal = container.querySelector('[class*="modal"]');
      expect(modal).toBeInTheDocument();
    });

    it("should apply empty string when className not provided", () => {
      const { container } = render(
        <Modal>
          <div>Content</div>
        </Modal>
      );

      const modal = container.querySelector('[class*="modal"]');
      expect(modal).toBeTruthy();
    });
  });

  describe("structure", () => {
    it("should nest modal inside backdrop", () => {
      const { container } = render(
        <Modal>
          <div>Content</div>
        </Modal>
      );

      const backdrop = container.querySelector('[class*="backdrop"]');
      const modal = backdrop?.querySelector('[class*="modal"]');

      expect(modal).toBeInTheDocument();
    });

    it("should have correct DOM hierarchy", () => {
      const { container } = render(
        <Modal>
          <span data-testid="content">Hello</span>
        </Modal>
      );

      const backdrop = container.firstElementChild;
      const modal = backdrop?.firstElementChild;
      const content = modal?.querySelector('[data-testid="content"]');

      expect(backdrop).toBeInTheDocument();
      expect(modal).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });
  });

  describe("text content", () => {
    it("should render text node children", () => {
      render(<Modal>Simple text content</Modal>);

      expect(screen.getByText("Simple text content")).toBeInTheDocument();
    });

    it("should render mixed content", () => {
      render(
        <Modal>
          Text before
          <span>Element</span>
          Text after
        </Modal>
      );

      expect(screen.getByText("Element")).toBeInTheDocument();
    });
  });
});

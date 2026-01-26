import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageHeader } from "./PageHeader";

describe("PageHeader", () => {
  describe("rendering", () => {
    it("should render header element", () => {
      render(<PageHeader title="Test Title" />);

      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("should render title text", () => {
      render(<PageHeader title="My Page Title" />);

      expect(
        screen.getByRole("heading", { name: "My Page Title" })
      ).toBeInTheDocument();
    });

    it("should render h1 heading", () => {
      render(<PageHeader title="Test" />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe("with icon", () => {
    it("should render icon when icon prop is provided", () => {
      render(<PageHeader title="Settings" icon="fa-solid fa-gear" />);

      const icon = document.querySelector("i");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass("fa-solid");
      expect(icon).toHaveClass("fa-gear");
    });

    it("should apply icon class from styles", () => {
      render(<PageHeader title="Settings" icon="fa-solid fa-gear" />);

      const icon = document.querySelector("i");
      expect(icon).toBeInTheDocument();
    });

    it("should render title with icon", () => {
      render(<PageHeader title="Dashboard" icon="fa-solid fa-dashboard" />);

      expect(
        screen.getByRole("heading", { name: /Dashboard/ })
      ).toBeInTheDocument();
      expect(document.querySelector("i")).toBeInTheDocument();
    });
  });

  describe("without icon", () => {
    it("should not render icon when icon prop is not provided", () => {
      render(<PageHeader title="No Icon" />);

      const icon = document.querySelector("i");
      expect(icon).not.toBeInTheDocument();
    });

    it("should render only title text", () => {
      render(<PageHeader title="Just Title" />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading.textContent).toBe("Just Title");
    });
  });

  describe("different titles", () => {
    it.each([
      "Home",
      "Settings",
      "User Profile",
      "Very Long Title With Many Words",
      "Title with special chars: @#$%",
      "123 Numeric Title",
    ])('should render title "%s"', (title) => {
      render(<PageHeader title={title} />);

      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    });
  });

  describe("different icons", () => {
    it.each([
      "fa-solid fa-home",
      "fa-regular fa-user",
      "bi bi-gear",
      "material-icons",
    ])('should render with icon class "%s"', (iconClass) => {
      render(<PageHeader title="Test" icon={iconClass} />);

      const icon = document.querySelector("i");
      expect(icon).toBeInTheDocument();

      iconClass.split(" ").forEach((cls) => {
        expect(icon).toHaveClass(cls);
      });
    });
  });

  describe("empty icon", () => {
    it("should not render icon when icon is empty string", () => {
      render(<PageHeader title="Test" icon="" />);

      const icon = document.querySelector("i");
      expect(icon).not.toBeInTheDocument();
    });
  });
});

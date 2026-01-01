import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "../Pagination/Pagination";

describe("Pagination", () => {
  const mockOnPageChange = vi.fn();
  const mockOnNext = vi.fn();
  const mockOnPrevious = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when totalPages <= 1", () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
        hasNext={false}
        hasPrevious={false}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render all page numbers when totalPages <= 5", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
        hasNext={true}
        hasPrevious={true}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should show ellipsis for large page counts", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
        hasNext={true}
        hasPrevious={true}
      />
    );

    const ellipses = screen.getAllByText("...");
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it("should highlight current page", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
        hasNext={true}
        hasPrevious={true}
      />
    );

    const currentButton = screen.getByText("3");
    expect(currentButton.className).toContain("active");
  });

  it("should call onPageChange when page number clicked", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
        hasNext={true}
        hasPrevious={false}
      />
    );

    fireEvent.click(screen.getByText("3"));

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it("should call onNext when next arrow clicked", () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
        hasNext={true}
        hasPrevious={false}
      />
    );

    const nextButton =
      container.querySelector(".fa-arrow-right")?.parentElement;
    fireEvent.click(nextButton!);

    expect(mockOnNext).toHaveBeenCalled();
  });

  it("should call onPrevious when previous arrow clicked", () => {
    const { container } = render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
        hasNext={true}
        hasPrevious={true}
      />
    );

    const prevButton = container.querySelector(".fa-arrow-left")?.parentElement;
    fireEvent.click(prevButton!);

    expect(mockOnPrevious).toHaveBeenCalled();
  });

  it("should disable previous button when hasPrevious is false", () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
        hasNext={true}
        hasPrevious={false}
      />
    );

    const prevButton = container.querySelector(".fa-arrow-left")?.parentElement;
    expect(prevButton).toBeDisabled();
  });

  it("should disable next button when hasNext is false", () => {
    const { container } = render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
        hasNext={false}
        hasPrevious={true}
      />
    );

    const nextButton =
      container.querySelector(".fa-arrow-right")?.parentElement;
    expect(nextButton).toBeDisabled();
  });
});

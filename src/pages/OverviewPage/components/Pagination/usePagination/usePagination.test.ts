import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePagination } from "../../Pagination/usePagination/usePagination";

describe("usePagination", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with page 1", () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 100, itemsPerPage: 10 })
    );

    expect(result.current.currentPage).toBe(1);
  });

  it("should calculate total pages correctly", () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 25, itemsPerPage: 10 })
    );

    expect(result.current.totalPages).toBe(3);
  });

  it("should handle exact division", () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 30, itemsPerPage: 10 })
    );

    expect(result.current.totalPages).toBe(3);
  });

  it("should calculate correct indices", () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 100, itemsPerPage: 10 })
    );

    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(10);
  });

  it("should navigate to specific page", () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 100, itemsPerPage: 10 })
    );

    act(() => {
      result.current.goToPage(3);
    });

    expect(result.current.currentPage).toBe(3);
    expect(result.current.startIndex).toBe(20);
    expect(result.current.endIndex).toBe(30);
  });

  it("should navigate to next page", () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 100, itemsPerPage: 10 })
    );

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPage).toBe(2);
  });

  it("should navigate to previous page", () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 100, itemsPerPage: 10 })
    );

    act(() => {
      result.current.goToPage(3);
      result.current.goToPreviousPage();
    });

    expect(result.current.currentPage).toBe(2);
  });

  it("should navigate to first page", () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 100, itemsPerPage: 10 })
    );

    act(() => {
      result.current.goToPage(5);
      result.current.goToFirstPage();
    });

    expect(result.current.currentPage).toBe(1);
  });

  it("should navigate to last page", () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 100, itemsPerPage: 10 })
    );

    act(() => {
      result.current.goToLastPage();
    });

    expect(result.current.currentPage).toBe(10);
  });

  it("should reset to page 1", () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 100, itemsPerPage: 10 })
    );

    act(() => {
      result.current.goToPage(5);
      result.current.reset();
    });

    expect(result.current.currentPage).toBe(1);
  });

  it("should report hasNextPage correctly", () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 25, itemsPerPage: 10 })
    );

    expect(result.current.hasNextPage).toBe(true);

    act(() => {
      result.current.goToLastPage();
    });

    expect(result.current.hasNextPage).toBe(false);
  });

  it("should report hasPreviousPage correctly", () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 25, itemsPerPage: 10 })
    );

    expect(result.current.hasPreviousPage).toBe(false);

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.hasPreviousPage).toBe(true);
  });

  it("should clamp page to valid range", () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 25, itemsPerPage: 10 })
    );

    act(() => {
      result.current.goToPage(100);
    });

    expect(result.current.currentPage).toBe(3);

    act(() => {
      result.current.goToPage(-5);
    });

    expect(result.current.currentPage).toBe(1);
  });

  it("should handle zero items", () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 0, itemsPerPage: 10 })
    );

    expect(result.current.totalPages).toBe(1);
    expect(result.current.currentPage).toBe(1);
  });

  it("should use default itemsPerPage", () => {
    const { result } = renderHook(() => usePagination({ totalItems: 100 }));

    expect(result.current.totalPages).toBe(10);
  });
});

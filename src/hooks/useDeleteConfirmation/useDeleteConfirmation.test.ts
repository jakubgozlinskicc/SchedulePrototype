import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDeleteConfirmation } from "./useDeleteConfirmation";

describe("useDeleteConfirmation", () => {
  it("should start with modal closed", () => {
    const { result } = renderHook(() => useDeleteConfirmation());
    expect(result.current.isDeleteModalOpen).toBe(false);
  });

  it("should open modal when openDeleteModal is called", () => {
    const { result } = renderHook(() => useDeleteConfirmation());

    act(() => {
      result.current.openDeleteModal();
    });

    expect(result.current.isDeleteModalOpen).toBe(true);
  });

  it("should close modal when closeDeleteModal is called", () => {
    const { result } = renderHook(() => useDeleteConfirmation());

    act(() => {
      result.current.openDeleteModal();
    });

    expect(result.current.isDeleteModalOpen).toBe(true);

    act(() => {
      result.current.closeDeleteModal();
    });

    expect(result.current.isDeleteModalOpen).toBe(false);
  });

  it("should handle multiple open/close cycles", () => {
    const { result } = renderHook(() => useDeleteConfirmation());

    act(() => {
      result.current.openDeleteModal();
    });
    expect(result.current.isDeleteModalOpen).toBe(true);

    act(() => {
      result.current.closeDeleteModal();
    });
    expect(result.current.isDeleteModalOpen).toBe(false);

    act(() => {
      result.current.openDeleteModal();
    });
    expect(result.current.isDeleteModalOpen).toBe(true);
  });
});

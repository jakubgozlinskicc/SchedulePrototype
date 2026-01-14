import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRecurringEventEdit } from "./useRecurringEventEdit";

describe("useRecurringEventEdit", () => {
  let mockOnClose: () => void;

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnClose = vi.fn();
  });

  describe("initial state", () => {
    it("should have isEditModalOpen set to true initially", () => {
      const { result } = renderHook(() => useRecurringEventEdit(mockOnClose));

      expect(result.current.isEditModalOpen).toBe(true);
    });

    it("should have isDeleteModalOpen set to false initially", () => {
      const { result } = renderHook(() => useRecurringEventEdit(mockOnClose));

      expect(result.current.isDeleteModalOpen).toBe(false);
    });

    it("should have isEditAll set to null initially", () => {
      const { result } = renderHook(() => useRecurringEventEdit(mockOnClose));

      expect(result.current.isEditAll).toBeNull();
    });
  });

  describe("confirmSingle", () => {
    it("should set isEditAll to false", () => {
      const { result } = renderHook(() => useRecurringEventEdit(mockOnClose));

      act(() => {
        result.current.confirmSingle();
      });

      expect(result.current.isEditAll).toBe(false);
    });

    it("should close edit modal", () => {
      const { result } = renderHook(() => useRecurringEventEdit(mockOnClose));

      act(() => {
        result.current.confirmSingle();
      });

      expect(result.current.isEditModalOpen).toBe(false);
    });

    it("should not call onClose callback", () => {
      const { result } = renderHook(() => useRecurringEventEdit(mockOnClose));

      act(() => {
        result.current.confirmSingle();
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe("confirmAll", () => {
    it("should set isEditAll to true", () => {
      const { result } = renderHook(() => useRecurringEventEdit(mockOnClose));

      act(() => {
        result.current.confirmAll();
      });

      expect(result.current.isEditAll).toBe(true);
    });

    it("should close edit modal", () => {
      const { result } = renderHook(() => useRecurringEventEdit(mockOnClose));

      act(() => {
        result.current.confirmAll();
      });

      expect(result.current.isEditModalOpen).toBe(false);
    });

    it("should not call onClose callback", () => {
      const { result } = renderHook(() => useRecurringEventEdit(mockOnClose));

      act(() => {
        result.current.confirmAll();
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe("handleClose", () => {
    it("should reset isEditAll to null", () => {
      const { result } = renderHook(() => useRecurringEventEdit(mockOnClose));

      act(() => {
        result.current.confirmSingle();
      });

      act(() => {
        result.current.handleClose();
      });

      expect(result.current.isEditAll).toBeNull();
    });

    it("should close edit modal", () => {
      const { result } = renderHook(() => useRecurringEventEdit(mockOnClose));

      act(() => {
        result.current.handleClose();
      });

      expect(result.current.isEditModalOpen).toBe(false);
    });

    it("should call onClose callback", () => {
      const { result } = renderHook(() => useRecurringEventEdit(mockOnClose));

      act(() => {
        result.current.handleClose();
      });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should reset isEditAll from true to null", () => {
      const { result } = renderHook(() => useRecurringEventEdit(mockOnClose));

      act(() => {
        result.current.confirmAll();
      });
      expect(result.current.isEditAll).toBe(true);

      act(() => {
        result.current.handleClose();
      });

      expect(result.current.isEditAll).toBeNull();
    });
  });

  describe("openDeleteModal", () => {
    it("should set isDeleteModalOpen to true", () => {
      const { result } = renderHook(() => useRecurringEventEdit(mockOnClose));

      act(() => {
        result.current.openDeleteModal();
      });

      expect(result.current.isDeleteModalOpen).toBe(true);
    });

    it("should not affect isEditModalOpen state", () => {
      const { result } = renderHook(() => useRecurringEventEdit(mockOnClose));

      act(() => {
        result.current.confirmSingle();
      });
      const editModalState = result.current.isEditModalOpen;

      act(() => {
        result.current.openDeleteModal();
      });

      expect(result.current.isEditModalOpen).toBe(editModalState);
    });
  });

  describe("closeDeleteModal", () => {
    it("should set isDeleteModalOpen to false", () => {
      const { result } = renderHook(() => useRecurringEventEdit(mockOnClose));

      act(() => {
        result.current.openDeleteModal();
      });

      act(() => {
        result.current.closeDeleteModal();
      });

      expect(result.current.isDeleteModalOpen).toBe(false);
    });

    it("should not affect other state", () => {
      const { result } = renderHook(() => useRecurringEventEdit(mockOnClose));

      act(() => {
        result.current.confirmAll();
        result.current.openDeleteModal();
      });

      act(() => {
        result.current.closeDeleteModal();
      });

      expect(result.current.isEditAll).toBe(true);
      expect(result.current.isEditModalOpen).toBe(false);
    });
  });

  describe("state transitions", () => {
    it("should allow opening and closing delete modal multiple times", () => {
      const { result } = renderHook(() => useRecurringEventEdit(mockOnClose));

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

    it("should maintain isEditAll state when toggling delete modal", () => {
      const { result } = renderHook(() => useRecurringEventEdit(mockOnClose));

      act(() => {
        result.current.confirmAll();
      });

      act(() => {
        result.current.openDeleteModal();
      });

      act(() => {
        result.current.closeDeleteModal();
      });

      expect(result.current.isEditAll).toBe(true);
    });

    it("should return all expected properties", () => {
      const { result } = renderHook(() => useRecurringEventEdit(mockOnClose));

      expect(result.current).toHaveProperty("isEditModalOpen");
      expect(result.current).toHaveProperty("isDeleteModalOpen");
      expect(result.current).toHaveProperty("isEditAll");
      expect(result.current).toHaveProperty("confirmSingle");
      expect(result.current).toHaveProperty("confirmAll");
      expect(result.current).toHaveProperty("handleClose");
      expect(result.current).toHaveProperty("openDeleteModal");
      expect(result.current).toHaveProperty("closeDeleteModal");
    });
  });
});

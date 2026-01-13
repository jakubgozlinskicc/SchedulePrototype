import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEventDelete } from "./useEventDelete";
import type { IEventRepository } from "../../../../../../events/useEvents/IEventRepository";
import type { Event } from "../../../../../../db/scheduleDb";
import { DeleteStrategyRegistry } from "../../../../../../events/useEvents/useEventData/useDeleteEvent/deleteStrategies/deleteStrategyRegistry";

vi.mock(
  "../../../../../../events/useEvents/useEventData/useDeleteEvent/deleteStrategies/deleteStrategyRegistry",
  () => ({
    DeleteStrategyRegistry: {
      executeDelete: vi.fn().mockResolvedValue(undefined),
    },
  })
);

const mockSingleEvent: Event = {
  id: 1,
  title: "Single Event",
  description: "",
  start: new Date("2025-01-15T10:00:00"),
  end: new Date("2025-01-15T11:00:00"),
  color: "#0000FF",
  recurrenceRule: { type: "none", interval: 1 },
};

const mockRecurringEvent: Event = {
  id: 2,
  title: "Recurring Event",
  description: "",
  start: new Date("2025-01-15T10:00:00"),
  end: new Date("2025-01-15T11:00:00"),
  color: "#FF0000",
  recurrenceRule: { type: "daily", interval: 1 },
};

const mockExpandedRecurringEvent: Event = {
  id: undefined,
  recurringEventId: 2,
  title: "Expanded Recurring Event",
  description: "",
  start: new Date("2025-01-16T10:00:00"),
  end: new Date("2025-01-16T11:00:00"),
  color: "#FF0000",
  recurrenceRule: { type: "daily", interval: 1 },
};

describe("useEventDelete", () => {
  let mockRepository: IEventRepository;
  let mockReloadEvents: () => Promise<void>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = {
      getEvents: vi.fn(),
      addEvent: vi.fn(),
      editEvent: vi.fn(),
      deleteEvent: vi.fn(),
      getEventById: vi.fn(),
      clearEvents: vi.fn(),
    };
    mockReloadEvents = vi.fn().mockResolvedValue(undefined);
  });
  describe("isRecurringEvent", () => {
    it("should return false for single event", () => {
      const { result } = renderHook(() =>
        useEventDelete(mockRepository, mockReloadEvents)
      );

      expect(result.current.isRecurringEvent(mockSingleEvent)).toBe(false);
    });

    it("should return true for recurring event with id", () => {
      const { result } = renderHook(() =>
        useEventDelete(mockRepository, mockReloadEvents)
      );

      expect(result.current.isRecurringEvent(mockRecurringEvent)).toBe(true);
    });

    it("should return true for expanded recurring event without id", () => {
      const { result } = renderHook(() =>
        useEventDelete(mockRepository, mockReloadEvents)
      );

      expect(result.current.isRecurringEvent(mockExpandedRecurringEvent)).toBe(
        true
      );
    });
  });

  describe("handleDeleteClick", () => {
    it("should open confirmation for recurring event", () => {
      const { result } = renderHook(() =>
        useEventDelete(mockRepository, mockReloadEvents)
      );

      act(() => {
        result.current.handleDeleteClick(mockRecurringEvent);
      });

      expect(result.current.eventToDelete).toEqual(mockRecurringEvent);
    });

    it("should delete immediately for single event", async () => {
      const { result } = renderHook(() =>
        useEventDelete(mockRepository, mockReloadEvents)
      );

      await act(async () => {
        result.current.handleDeleteClick(mockSingleEvent);
      });

      expect(DeleteStrategyRegistry.executeDelete).toHaveBeenCalledWith(
        mockSingleEvent,
        mockRepository,
        { isEditAll: false }
      );
      expect(mockReloadEvents).toHaveBeenCalled();
      expect(result.current.eventToDelete).toBeNull();
    });
  });

  describe("handleDeleteSingle", () => {
    it("should delete single occurrence and reload events", async () => {
      const { result } = renderHook(() =>
        useEventDelete(mockRepository, mockReloadEvents)
      );

      act(() => {
        result.current.handleDeleteClick(mockRecurringEvent);
      });

      await act(async () => {
        await result.current.handleDeleteSingle();
      });

      expect(DeleteStrategyRegistry.executeDelete).toHaveBeenCalledWith(
        mockRecurringEvent,
        mockRepository,
        { isEditAll: false }
      );
      expect(mockReloadEvents).toHaveBeenCalled();
      expect(result.current.eventToDelete).toBeNull();
    });

    it("should not delete if no event selected", async () => {
      const { result } = renderHook(() =>
        useEventDelete(mockRepository, mockReloadEvents)
      );

      await act(async () => {
        await result.current.handleDeleteSingle();
      });

      expect(DeleteStrategyRegistry.executeDelete).not.toHaveBeenCalled();
    });
  });

  describe("handleDeleteAll", () => {
    it("should delete all occurrences and reload events", async () => {
      const { result } = renderHook(() =>
        useEventDelete(mockRepository, mockReloadEvents)
      );

      act(() => {
        result.current.handleDeleteClick(mockRecurringEvent);
      });

      await act(async () => {
        await result.current.handleDeleteAll();
      });

      expect(DeleteStrategyRegistry.executeDelete).toHaveBeenCalledWith(
        mockRecurringEvent,
        mockRepository,
        { isEditAll: true }
      );
      expect(mockReloadEvents).toHaveBeenCalled();
      expect(result.current.eventToDelete).toBeNull();
    });

    it("should not delete if no event selected", async () => {
      const { result } = renderHook(() =>
        useEventDelete(mockRepository, mockReloadEvents)
      );

      await act(async () => {
        await result.current.handleDeleteAll();
      });

      expect(DeleteStrategyRegistry.executeDelete).not.toHaveBeenCalled();
    });
  });

  describe("handleCancelDelete", () => {
    it("should clear eventToDelete", () => {
      const { result } = renderHook(() =>
        useEventDelete(mockRepository, mockReloadEvents)
      );

      act(() => {
        result.current.handleDeleteClick(mockRecurringEvent);
      });

      expect(result.current.eventToDelete).not.toBeNull();

      act(() => {
        result.current.handleCancelDelete();
      });

      expect(result.current.eventToDelete).toBeNull();
    });
  });

  describe("error handling", () => {
    it("should handle delete errors gracefully", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      vi.mocked(DeleteStrategyRegistry.executeDelete).mockRejectedValueOnce(
        new Error("Delete failed")
      );

      const { result } = renderHook(() =>
        useEventDelete(mockRepository, mockReloadEvents)
      );

      await act(async () => {
        result.current.handleDeleteClick(mockSingleEvent);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error deleting event:",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRecurringEdit } from "./useRecurringEdit";
import type { Event } from "../../../../db/scheduleDb";
import type { IEventRepository } from "../../IEventRepository";

let mockEventData: Event;
const mockSetEventData = vi.fn();
const mockSetIsDeleteAll = vi.fn();

vi.mock("../../useEventDataContext/useEventDataContext", () => ({
  useEventDataContext: () => ({
    eventData: mockEventData,
    setEventData: mockSetEventData,
    setIsDeleteAll: mockSetIsDeleteAll,
  }),
}));

describe("useRecurringEdit", () => {
  let mockRepository: IEventRepository;

  beforeEach(() => {
    vi.clearAllMocks();

    mockRepository = {
      addEvent: vi.fn().mockResolvedValue(1),
      getEvents: vi.fn().mockResolvedValue([]),
      getEventById: vi.fn().mockResolvedValue(null),
      editEvent: vi.fn().mockResolvedValue(undefined),
      deleteEvent: vi.fn().mockResolvedValue(undefined),
      clearEvents: vi.fn().mockResolvedValue(undefined),
    };

    mockEventData = {
      id: 1,
      title: "Test event",
      description: "Test description",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
    };
  });

  describe("handleEditSingle", () => {
    it("should set isDeleteAll to false", () => {
      const { result } = renderHook(() => useRecurringEdit(mockRepository));

      act(() => {
        result.current.handleEditSingle();
      });

      expect(mockSetIsDeleteAll).toHaveBeenCalledWith(false);
    });

    it("should call setEventData with previous state", () => {
      const { result } = renderHook(() => useRecurringEdit(mockRepository));

      act(() => {
        result.current.handleEditSingle();
      });

      expect(mockSetEventData).toHaveBeenCalledTimes(1);
      expect(mockSetEventData).toHaveBeenCalledWith(expect.any(Function));

      const updaterFn = mockSetEventData.mock.calls[0][0];
      const prevState = { title: "Previous", color: "#FF0000" };
      const newState = updaterFn(prevState);

      expect(newState).toEqual({ ...prevState });
    });
  });

  describe("handleEditAll", () => {
    it("should set isDeleteAll to true", async () => {
      mockEventData = {
        ...mockEventData,
        recurringEventId: 5,
      };

      const { result } = renderHook(() => useRecurringEdit(mockRepository));

      await act(async () => {
        await result.current.handleEditAll();
      });

      expect(mockSetIsDeleteAll).toHaveBeenCalledWith(true);
    });

    it("should return early when recurringEventId is missing", async () => {
      mockEventData = {
        ...mockEventData,
        recurringEventId: undefined,
      };

      const { result } = renderHook(() => useRecurringEdit(mockRepository));

      await act(async () => {
        await result.current.handleEditAll();
      });

      expect(mockSetIsDeleteAll).toHaveBeenCalledWith(true);
      expect(mockRepository.getEventById).not.toHaveBeenCalled();
      expect(mockSetEventData).not.toHaveBeenCalled();
    });

    it("should fetch parent event and set it as eventData", async () => {
      const parentEvent: Event = {
        id: 5,
        title: "Parent event",
        description: "Parent description",
        start: new Date("2025-12-01T10:00:00"),
        end: new Date("2025-12-01T11:00:00"),
        color: "#00FF00",
        recurrenceRule: { type: "daily", interval: 1 },
      };

      mockEventData = {
        ...mockEventData,
        recurringEventId: 5,
      };

      mockRepository.getEventById = vi.fn().mockResolvedValue(parentEvent);

      const { result } = renderHook(() => useRecurringEdit(mockRepository));

      await act(async () => {
        await result.current.handleEditAll();
      });

      expect(mockRepository.getEventById).toHaveBeenCalledWith(5);
      expect(mockSetEventData).toHaveBeenCalledWith(parentEvent);
    });

    it("should not set eventData when parent event is not found", async () => {
      mockEventData = {
        ...mockEventData,
        recurringEventId: 999,
      };

      mockRepository.getEventById = vi.fn().mockResolvedValue(null);

      const { result } = renderHook(() => useRecurringEdit(mockRepository));

      await act(async () => {
        await result.current.handleEditAll();
      });

      expect(mockRepository.getEventById).toHaveBeenCalledWith(999);
      expect(mockSetEventData).not.toHaveBeenCalled();
    });

    it("should handle error when fetching parent event fails", async () => {
      mockEventData = {
        ...mockEventData,
        recurringEventId: 5,
      };

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockRepository.getEventById = vi
        .fn()
        .mockRejectedValue(new Error("Database error"));

      const { result } = renderHook(() => useRecurringEdit(mockRepository));

      await act(async () => {
        await result.current.handleEditAll();
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error loading parent event:",
        expect.any(Error)
      );
      expect(mockSetEventData).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});

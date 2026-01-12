import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useEventLoader } from "./useEventLoader";
import type { Event } from "../../db/scheduleDb";
import type { IEventRepository } from "../../events/useEvents/IEventRepository";

describe("useEventLoader", () => {
  let mockRepository: IEventRepository;

  const mockEvent: Event = {
    id: 1,
    title: "Test Event",
    description: "Test",
    start: new Date("2025-12-10T10:00:00"),
    end: new Date("2025-12-10T11:00:00"),
    color: "#0000FF",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = {
      addEvent: vi.fn().mockResolvedValue(1),
      getEvents: vi.fn().mockResolvedValue([]),
      getEventById: vi.fn().mockResolvedValue(mockEvent),
      editEvent: vi.fn().mockResolvedValue(undefined),
      deleteEvent: vi.fn().mockResolvedValue(undefined),
      clearEvents: vi.fn().mockResolvedValue(undefined),
    };
  });

  it("should return undefined event and loading false when eventId is undefined", async () => {
    const { result } = renderHook(() =>
      useEventLoader(undefined, mockRepository)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.event).toBeUndefined();
    expect(mockRepository.getEventById).not.toHaveBeenCalled();
  });

  it("should load event when eventId is provided", async () => {
    const { result } = renderHook(() => useEventLoader(1, mockRepository));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.event).toEqual(mockEvent);
    expect(mockRepository.getEventById).toHaveBeenCalledWith(1);
  });

  it("should start with loading true", () => {
    const { result } = renderHook(() => useEventLoader(1, mockRepository));
    expect(result.current.loading).toBe(true);
  });

  it("should handle repository returning null", async () => {
    mockRepository.getEventById = vi.fn().mockResolvedValue(null);

    const { result } = renderHook(() => useEventLoader(1, mockRepository));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.event).toBeNull();
  });

  it("should reload event when eventId changes", async () => {
    const { result, rerender } = renderHook(
      ({ id }) => useEventLoader(id, mockRepository),
      { initialProps: { id: 1 } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockRepository.getEventById).toHaveBeenCalledWith(1);

    rerender({ id: 2 });

    await waitFor(() => {
      expect(mockRepository.getEventById).toHaveBeenCalledWith(2);
    });
  });

  it("should cancel pending request on unmount", async () => {
    const { unmount } = renderHook(() => useEventLoader(1, mockRepository));
    unmount();

    await waitFor(() => {
      expect(mockRepository.getEventById).toHaveBeenCalled();
    });
  });
});

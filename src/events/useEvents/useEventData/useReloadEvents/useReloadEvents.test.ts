import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useReloadEvents } from "./useReloadEvents";
import type { Event } from "../../../../db/scheduleDb";
import { expandAllEvents } from "./eventExpander";
import type { IEventRepository } from "../../IEventRepository";

const mockSetEvents = vi.fn();

vi.mock("../../useEventDataContext/useEventDataContext", () => ({
  useEventDataContext: () => ({
    setEvents: mockSetEvents,
  }),
}));

vi.mock("./eventExpander", () => ({
  expandAllEvents: vi.fn((events) => events),
}));

describe("useReloadEvents", () => {
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
  });

  it("should reload and expand events from repository", async () => {
    const eventsFromRepo: Event[] = [
      {
        id: 1,
        title: "Test event",
        description: "Description",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#00FF00",
      },
    ];
    const expandedEvents = [...eventsFromRepo, { ...eventsFromRepo[0], id: 2 }];

    mockRepository.getEvents = vi.fn().mockResolvedValue(eventsFromRepo);
    (expandAllEvents as ReturnType<typeof vi.fn>).mockReturnValue(
      expandedEvents
    );

    const { result } = renderHook(() => useReloadEvents(mockRepository));

    await act(async () => {
      await result.current.reloadEvents();
    });

    expect(mockRepository.getEvents).toHaveBeenCalledTimes(1);
    expect(expandAllEvents).toHaveBeenCalledWith(eventsFromRepo);
    expect(mockSetEvents).toHaveBeenCalledWith(expandedEvents);
  });

  it("should handle error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockRepository.getEvents = vi.fn().mockRejectedValue(new Error("DB error"));

    const { result } = renderHook(() => useReloadEvents(mockRepository));

    await act(async () => {
      await result.current.reloadEvents();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error during reloading events:",
      expect.any(Error)
    );
    expect(mockSetEvents).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

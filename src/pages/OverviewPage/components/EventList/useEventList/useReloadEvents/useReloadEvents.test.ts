import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useReloadEvents } from "./useReloadEvents";
import type { IEventRepository } from "../../../../../../events/useEvents/IEventRepository";
import type { Event } from "../../../../../../db/scheduleDb";

vi.mock(
  "../../../../../../events/useEvents/useEventData/useReloadEvents/eventExpander",
  () => ({
    expandAllEvents: vi.fn((events) => events),
  })
);

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Test Event",
    description: "Description",
    start: new Date("2025-01-15T10:00:00"),
    end: new Date("2025-01-15T11:00:00"),
    color: "#0000FF",
    recurrenceRule: { type: "none", interval: 1 },
  },
];

describe("useReloadEvents", () => {
  let mockRepository: IEventRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = {
      getEvents: vi.fn().mockResolvedValue(mockEvents),
      addEvent: vi.fn(),
      editEvent: vi.fn(),
      deleteEvent: vi.fn(),
      getEventById: vi.fn(),
      clearEvents: vi.fn(),
    };
  });

  it("should start with empty events array", () => {
    const { result } = renderHook(() => useReloadEvents(mockRepository));

    expect(result.current.events).toEqual([]);
  });

  it("should load events when reloadEvents is called", async () => {
    const { result } = renderHook(() => useReloadEvents(mockRepository));

    await act(async () => {
      await result.current.reloadEvents();
    });

    expect(mockRepository.getEvents).toHaveBeenCalledTimes(1);
    expect(result.current.events).toEqual(mockEvents);
  });

  it("should handle repository errors gracefully", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockRepository.getEvents = vi.fn().mockRejectedValue(new Error("DB Error"));

    const { result } = renderHook(() => useReloadEvents(mockRepository));

    await act(async () => {
      await result.current.reloadEvents();
    });

    expect(result.current.events).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error during reloading events:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it("should update events on multiple reloadEvents calls", async () => {
    const updatedEvents: Event[] = [
      ...mockEvents,
      {
        id: 2,
        title: "New Event",
        description: "",
        start: new Date("2025-01-16T10:00:00"),
        end: new Date("2025-01-16T11:00:00"),
        color: "#FF0000",
        recurrenceRule: { type: "none", interval: 1 },
      },
    ];

    const { result } = renderHook(() => useReloadEvents(mockRepository));

    await act(async () => {
      await result.current.reloadEvents();
    });

    expect(result.current.events).toEqual(mockEvents);

    mockRepository.getEvents = vi.fn().mockResolvedValue(updatedEvents);

    await act(async () => {
      await result.current.reloadEvents();
    });

    expect(result.current.events).toEqual(updatedEvents);
  });
});

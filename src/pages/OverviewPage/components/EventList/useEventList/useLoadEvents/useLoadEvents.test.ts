import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useLoadEvents } from "./useLoadEvents";
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

describe("useLoadEvents", () => {
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

  it("should load events on mount", async () => {
    const { result } = renderHook(() => useLoadEvents(mockRepository));

    await waitFor(() => {
      expect(result.current.events).toEqual(mockEvents);
    });

    expect(mockRepository.getEvents).toHaveBeenCalledTimes(1);
  });

  it("should return reloadEvents function", async () => {
    const { result } = renderHook(() => useLoadEvents(mockRepository));

    expect(result.current.reloadEvents).toBeDefined();
    expect(typeof result.current.reloadEvents).toBe("function");
  });

  it("should start with empty events before loading completes", () => {
    const { result } = renderHook(() => useLoadEvents(mockRepository));

    expect(result.current.events).toEqual([]);
  });

  it("should handle loading errors gracefully", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockRepository.getEvents = vi
      .fn()
      .mockRejectedValue(new Error("Load Error"));

    const { result } = renderHook(() => useLoadEvents(mockRepository));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    expect(result.current.events).toEqual([]);
    consoleErrorSpy.mockRestore();
  });

  it("should allow manual reload with reloadEvents", async () => {
    const { result } = renderHook(() => useLoadEvents(mockRepository));

    await waitFor(() => {
      expect(result.current.events).toEqual(mockEvents);
    });

    const updatedEvents: Event[] = [
      {
        id: 2,
        title: "Updated Event",
        description: "",
        start: new Date("2025-01-20T10:00:00"),
        end: new Date("2025-01-20T11:00:00"),
        color: "#FF0000",
        recurrenceRule: { type: "none", interval: 1 },
      },
    ];

    mockRepository.getEvents = vi.fn().mockResolvedValue(updatedEvents);

    await result.current.reloadEvents();

    await waitFor(() => {
      expect(result.current.events).toEqual(updatedEvents);
    });
  });
});

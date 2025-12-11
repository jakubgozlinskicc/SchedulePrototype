import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useReloadEvents } from "./useReloadEvents";
import type { Event } from "../../../../db/scheduleDb";
import type { IEventRepository } from "../IEventRepository";

const mockSetEvents = vi.fn();

vi.mock("../useContext/useEventDataContext", () => ({
  useEventDataContext: () => ({
    setEvents: mockSetEvents,
  }),
}));

describe("useReloadEvents", () => {
  let mockRepository: IEventRepository;

  beforeEach(() => {
    vi.clearAllMocks();

    mockRepository = {
      addEvent: vi.fn().mockResolvedValue(1),
      getEvents: vi.fn().mockResolvedValue([]),
      editEvent: vi.fn().mockResolvedValue(undefined),
      deleteEvent: vi.fn().mockResolvedValue(undefined),
      clearEvents: vi.fn().mockResolvedValue(undefined),
    };
  });

  it("It should reload events from repository", async () => {
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
    mockRepository.getEvents = vi.fn().mockResolvedValue(eventsFromRepo);

    const { result } = renderHook(() => useReloadEvents(mockRepository));

    await act(async () => {
      await result.current.reloadEvents();
    });

    expect(mockRepository.getEvents).toHaveBeenCalledTimes(1);
    expect(mockSetEvents).toHaveBeenCalledWith(eventsFromRepo);
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useUpdateEventTime } from "./useUpdateEventTime";
import type { IEventRepository } from "../IEventRepository";

const mockReloadEvents = vi.fn();

vi.mock("./useReloadEvents", () => ({
  useReloadEvents: () => ({
    reloadEvents: mockReloadEvents,
  }),
}));

describe("useUpdateEventTime", () => {
  let mockRepository: IEventRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReloadEvents.mockResolvedValue(undefined);

    mockRepository = {
      addEvent: vi.fn().mockResolvedValue(1),
      getEvents: vi.fn().mockResolvedValue([]),
      editEvent: vi.fn().mockResolvedValue(undefined),
      deleteEvent: vi.fn().mockResolvedValue(undefined),
      clearEvents: vi.fn().mockResolvedValue(undefined),
    };
  });

  it("It should update event time", async () => {
    const { result } = renderHook(() => useUpdateEventTime(mockRepository));

    const newStart = new Date("2025-12-12T12:00:00");
    const newEnd = new Date("2025-12-12T13:00:00");

    await act(async () => {
      await result.current.updateEventTime(1, newStart, newEnd);
    });

    expect(mockRepository.editEvent).toHaveBeenCalledWith(1, {
      start: newStart,
      end: newEnd,
    });
    expect(mockReloadEvents).toHaveBeenCalledTimes(1);
  });
});

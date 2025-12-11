import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDeleteEvent } from "./useDeleteEvent";
import type { Event } from "../../../../../db/scheduleDb";
import type { IEventRepository } from "../../IEventRepository";

let mockEventData: Event;
const mockReloadEvents = vi.fn();

vi.mock("../../useEventDataContext/useEventDataContext", () => ({
  useEventDataContext: () => ({
    eventData: mockEventData,
  }),
}));

vi.mock("../useReloadEvents/useReloadEvents", () => ({
  useReloadEvents: () => ({
    reloadEvents: mockReloadEvents,
  }),
}));

describe("useDeleteEvent", () => {
  let mockRepository: IEventRepository;
  let mockCloseModal: () => void;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCloseModal = vi.fn();
    mockReloadEvents.mockResolvedValue(undefined);

    mockRepository = {
      addEvent: vi.fn().mockResolvedValue(1),
      getEvents: vi.fn().mockResolvedValue([]),
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

  it("It should delete current event when id exists", async () => {
    const { result } = renderHook(() =>
      useDeleteEvent(mockCloseModal, mockRepository)
    );

    await act(async () => {
      await result.current.deleteCurrentEvent();
    });

    expect(mockRepository.deleteEvent).toHaveBeenCalledWith(1);
    expect(mockReloadEvents).toHaveBeenCalledTimes(1);
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it("It should not delete event when id is missing", async () => {
    mockEventData = {
      title: "No id event",
      description: "No id",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#FF0000",
    };

    const { result } = renderHook(() =>
      useDeleteEvent(mockCloseModal, mockRepository)
    );

    await act(async () => {
      await result.current.deleteCurrentEvent();
    });

    expect(mockRepository.deleteEvent).not.toHaveBeenCalled();
    expect(mockCloseModal).not.toHaveBeenCalled();
  });
});

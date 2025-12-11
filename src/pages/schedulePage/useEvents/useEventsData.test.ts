import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useEventsData } from "./useEventsData";
import type { Event } from "../../../db/scheduleDb";
import type { IEventRepository } from "./IEventRepository";

describe("useEventData", () => {
  const mockCloseModal = vi.fn();

  const mockEvents: Event[] = [
    {
      id: 1,
      title: "test1",
      description: "test1",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
    },
    {
      id: 2,
      title: "test2",
      description: "test2",
      start: new Date("2025-12-11T10:00:00"),
      end: new Date("2025-12-11T11:00:00"),
      color: "#0000FF",
    },
  ];

  const mockRepository: IEventRepository = {
    getEvents: vi.fn().mockResolvedValue(mockEvents),
    addEvent: vi.fn().mockResolvedValue(3),
    editEvent: vi.fn().mockResolvedValue(undefined),
    deleteEvent: vi.fn().mockResolvedValue(undefined),
    clearEvents: vi.fn().mockResolvedValue(undefined),
  };

  const mockEventData: Event = {
    id: 1,
    title: "test",
    description: "test",
    start: new Date("2025-12-10T10:00:00"),
    end: new Date("2025-12-10T11:00:00"),
    color: "#0000FF",
  };
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should load events on mount", async () => {
    const { result } = renderHook(() =>
      useEventsData(mockEventData, mockCloseModal, mockRepository)
    );

    await waitFor(() => {
      expect(result.current.events).toEqual(mockEvents);
    });

    expect(mockRepository.getEvents).toHaveBeenCalled();
  });

  it("should handle submit for new event", async () => {
    const newEvent = { ...mockEventData, id: undefined };
    const { result } = renderHook(() =>
      useEventsData(newEvent, mockCloseModal, mockRepository)
    );

    await waitFor(() => {
      expect(result.current.events).toEqual(mockEvents);
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
    });

    expect(mockRepository.addEvent).toHaveBeenCalledWith(newEvent);
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it("should handle submit for existing event", async () => {
    const { result } = renderHook(() =>
      useEventsData(mockEventData, mockCloseModal, mockRepository)
    );

    await waitFor(() => {
      expect(result.current.events).toEqual(mockEvents);
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
    });

    expect(mockRepository.editEvent).toHaveBeenCalledWith(1, mockEventData);
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it("should delete event", async () => {
    const { result } = renderHook(() =>
      useEventsData(mockEventData, mockCloseModal, mockRepository)
    );

    await waitFor(() => {
      expect(result.current.events).toEqual(mockEvents);
    });

    await act(async () => {
      await result.current.deleteCurrentEvent();
    });

    expect(mockRepository.deleteEvent).toHaveBeenCalledWith(1);
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it("should not delete event without id", async () => {
    const eventWithoutId = { ...mockEventData, id: undefined };
    const { result } = renderHook(() =>
      useEventsData(eventWithoutId, mockCloseModal, mockRepository)
    );

    await act(async () => {
      await result.current.deleteCurrentEvent();
    });

    expect(mockRepository.deleteEvent).not.toHaveBeenCalled();
  });

  it("should update event time", async () => {
    const { result } = renderHook(() =>
      useEventsData(mockEventData, mockCloseModal, mockRepository)
    );

    const newStart = new Date("2024-03-17T10:00:00");
    const newEnd = new Date("2024-03-17T11:00:00");

    await act(async () => {
      await result.current.updateEventTime(1, newStart, newEnd);
    });

    expect(mockRepository.editEvent).toHaveBeenCalledWith(1, {
      start: newStart,
      end: newEnd,
    });
  });

  it("should handle errors during loading", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const failingRepo = {
      ...mockRepository,
      getEvents: vi.fn().mockRejectedValue(new Error("Load failed")),
    };

    renderHook(() => useEventsData(mockEventData, mockCloseModal, failingRepo));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it("should handle errors during delete", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const failingRepo = {
      ...mockRepository,
      deleteEvent: vi.fn().mockRejectedValue(new Error("Delete failed")),
    };

    const { result } = renderHook(() =>
      useEventsData(mockEventData, mockCloseModal, failingRepo)
    );

    await act(async () => {
      await result.current.deleteCurrentEvent();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});

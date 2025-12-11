import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useEventsData } from "./useEventsData";
import type { Event } from "../../../db/scheduleDb";
import type { IEventRepository } from "./IEventRepository";

let mockEventData: Event;

vi.mock("./useContext/useEventDataContext", () => ({
  useEventDataContext: () => ({
    eventData: mockEventData,
    setEventData: vi.fn(),
  }),
}));

describe("useEventsData", () => {
  let mockRepository: IEventRepository;
  let mockCloseModal: () => void;

  beforeEach(() => {
    mockCloseModal = vi.fn();

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

  it("It should load events on mount", async () => {
    const eventsFromRepo: Event[] = [
      {
        id: 2,
        title: "Repo event",
        description: "From repository",
        start: new Date("2025-12-11T10:00:00"),
        end: new Date("2025-12-11T11:00:00"),
        color: "#00FF00",
      },
    ];
    mockRepository.getEvents = vi.fn().mockResolvedValue(eventsFromRepo);

    const { result } = renderHook(() =>
      useEventsData(mockCloseModal, mockRepository)
    );

    await waitFor(() => {
      expect(mockRepository.getEvents).toHaveBeenCalledTimes(1);
      expect(result.current.events).toEqual(eventsFromRepo);
    });
  });

  it("It should delete current event when id exists", async () => {
    const { result } = renderHook(() =>
      useEventsData(mockCloseModal, mockRepository)
    );

    await act(async () => {
      await result.current.deleteCurrentEvent();
    });

    expect(mockRepository.deleteEvent).toHaveBeenCalledWith(1);
    expect(mockRepository.getEvents).toHaveBeenCalledTimes(2);
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
      useEventsData(mockCloseModal, mockRepository)
    );

    await act(async () => {
      await result.current.deleteCurrentEvent();
    });

    expect(mockRepository.deleteEvent).not.toHaveBeenCalled();
    expect(mockCloseModal).not.toHaveBeenCalled();
  });

  it("It should update event time", async () => {
    const { result } = renderHook(() =>
      useEventsData(mockCloseModal, mockRepository)
    );

    const newStart = new Date("2025-12-12T12:00:00");
    const newEnd = new Date("2025-12-12T13:00:00");

    await act(async () => {
      await result.current.updateEventTime(1, newStart, newEnd);
    });

    expect(mockRepository.editEvent).toHaveBeenCalledWith(1, {
      start: newStart,
      end: newEnd,
    });
    expect(mockRepository.getEvents).toHaveBeenCalledTimes(2);
  });

  it("It should submit form and edit event when id exists", async () => {
    const { result } = renderHook(() =>
      useEventsData(mockCloseModal, mockRepository)
    );

    const fakeEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(fakeEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockRepository.editEvent).toHaveBeenCalledWith(
      mockEventData.id as number,
      mockEventData
    );
    expect(mockRepository.addEvent).not.toHaveBeenCalled();
    expect(mockRepository.getEvents).toHaveBeenCalledTimes(2);
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it("It should submit form and add event when id is missing", async () => {
    mockEventData = {
      title: "New event",
      description: "New",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#FF0000",
    };

    const { result } = renderHook(() =>
      useEventsData(mockCloseModal, mockRepository)
    );

    const fakeEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(fakeEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockRepository.addEvent).toHaveBeenCalledWith(mockEventData);
    expect(mockRepository.editEvent).not.toHaveBeenCalled();
    expect(mockRepository.getEvents).toHaveBeenCalledTimes(2);
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });
});

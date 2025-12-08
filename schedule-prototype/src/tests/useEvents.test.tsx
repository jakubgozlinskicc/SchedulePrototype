import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

import { useEvents } from "../hooks/useEvents";
import type { Event } from "../db/scheduleDb";

vi.mock("../db/eventRepo.ts", () => ({
  getEvents: vi.fn(),
  addEvent: vi.fn(),
  deleteEvent: vi.fn(),
  editEvent: vi.fn(),
}));

import {
  getEvents,
  addEvent,
  deleteEvent,
  editEvent,
} from "../db/eventRepository";

const mockedGetEvents = vi.mocked(getEvents);
const mockedAddEvent = vi.mocked(addEvent);
const mockedDeleteEvent = vi.mocked(deleteEvent);
const mockedEditEvent = vi.mocked(editEvent);

const baseEvent: Event = {
  id: 1,
  title: "test",
  description: "test",
  start: new Date(),
  end: new Date(),
  color: "#ffffff",
};

describe("useEvents hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Ładuje eventy przy montowaniu UseEffect", async () => {
    const events: Event[] = [baseEvent];
    mockedGetEvents.mockResolvedValueOnce(events);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.events).toEqual(events);
    });
    expect(mockedGetEvents).toBeCalled();
  });

  it("openAddModal ustawia tryb add i otwiera modal z danymi startowymi", () => {
    mockedGetEvents.mockResolvedValueOnce([]);
    const { result } = renderHook(() => useEvents());

    const now = new Date();
    const later = new Date();

    const initial = {
      color: "#ffffff",
      start: now,
      end: later,
    };

    act(() => {
      result.current.openAddModal(initial);
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.modalMode).toBe("add");
    expect(result.current.editingEventId).toBeNull();
    expect(result.current.eventData.start.getTime()).toBe(now.getTime());
    expect(result.current.eventData.end.getTime()).toBe(later.getTime());
    expect(result.current.eventData.color).toBe("#ffffff");
  });

  it("openEditModal ustawia dane eventu i tryb view", async () => {
    mockedGetEvents.mockResolvedValueOnce([]);
    const { result } = renderHook(() => useEvents());

    act(() => {
      result.current.openEditModal(baseEvent);
    });

    expect(result.current.modalMode).toBe("view");
    expect(result.current.eventData.title).toBe(baseEvent.title);
    expect(result.current.eventData.description).toBe(baseEvent.description);
    expect(result.current.eventData.color).toBe(baseEvent.color);
    expect(result.current.eventData.end).toBe(baseEvent.end);
    expect(result.current.eventData.start).toBe(baseEvent.start);
  });

  it("closeModal zamyka modal i resetuje dane", () => {
    mockedGetEvents.mockResolvedValueOnce([]);
    const { result } = renderHook(() => useEvents());

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.editingEventId).toBeNull();
    //dane po resescie
    expect(result.current.eventData.title).toBe("");
    expect(result.current.eventData.description).toBe("");
  });

  it("beginEditCurrentEvent zmienia modalMode na 'edit' tylko gdy jest editingEventId", () => {
    mockedGetEvents.mockResolvedValueOnce([]);
    const { result } = renderHook(() => useEvents());

    act(() => {
      result.current.beginEditCurrentEvent();
    });
    expect(result.current.modalMode).toBe("add");

    act(() => {
      result.current.openEditModal(baseEvent);
    });
    act(() => {
      result.current.beginEditCurrentEvent();
    });

    expect(result.current.modalMode).toBe("edit");
  });

  it("deleteCurrentEvent usuwa event, odświeża listę i zamyka modal", async () => {
    mockedGetEvents
      .mockResolvedValueOnce([baseEvent])
      .mockResolvedValueOnce([]);

    mockedDeleteEvent.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.events).toEqual([baseEvent]);
    });

    act(() => {
      result.current.openEditModal(baseEvent);
    });

    await act(() => {
      result.current.deleteCurrentEvent();
    });

    expect(mockedDeleteEvent).toBeCalledTimes(1);
    expect(mockedGetEvents).toBeCalledTimes(2);
    expect(result.current.events).toEqual([]);
    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.editingEventId).toBeNull();
  });

  it("handleAddEvent dodaje event, odswieza liste, resetuje formularz i zamyka modal", async () => {
    mockedGetEvents
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([baseEvent]);

    mockedAddEvent.mockResolvedValueOnce(1);

    const { result } = renderHook(() => useEvents());

    const newEventData = {
      title: "Nowy",
      description: "Nowy opis",
      start: new Date(),
      end: new Date(),
      color: "#ffffff",
    };

    act(() => {
      result.current.setEventData(newEventData);
    });

    const fakeFormEvent = {
      preventDefault: vi.fn(),
    };

    await act(async () => {
      await result.current.handleAddEvent(fakeFormEvent as any);
    });

    expect(fakeFormEvent.preventDefault).toHaveBeenCalled();
    expect(mockedAddEvent).toHaveBeenCalledWith(newEventData);
    expect(mockedGetEvents).toHaveBeenCalledTimes(2);
    expect(result.current.events).toEqual([baseEvent]);
    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.eventData.title).toBe("");
  });

  it("handleUpdateEvent aktualizuje event, odswieza listę i zamyka modal", async () => {
    mockedGetEvents
      .mockResolvedValueOnce([baseEvent])
      .mockResolvedValueOnce([{ ...baseEvent, title: "zmieniony tytul" }]);

    mockedEditEvent.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.events).toEqual([baseEvent]);
    });

    act(() => {
      result.current.openEditModal(baseEvent);
    });

    const updatedData = {
      ...result.current.eventData,
      title: "zmieniony tytul",
    };

    act(() => {
      result.current.setEventData(updatedData);
    });

    const fakeFormEvent = {
      preventDefault: vi.fn(),
    } as any;

    await act(async () => {
      await result.current.handleUpdateEvent(fakeFormEvent);
    });

    expect(fakeFormEvent.preventDefault).toHaveBeenCalled();
    expect(mockedEditEvent).toHaveBeenCalledWith(1, updatedData);
    expect(result.current.events[0].title).toBe("zmieniony tytul");
    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.editingEventId).toBeNull();
  });

  it("updateEventTime aktualizuje czas eventu i odswieza liste", async () => {
    const newStart = new Date();
    const newEnd = new Date();

    mockedGetEvents
      .mockResolvedValueOnce([baseEvent])
      .mockResolvedValueOnce([{ ...baseEvent, start: newStart, end: newEnd }]);

    mockedEditEvent.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.events).toEqual([baseEvent]);
    });

    await act(async () => {
      await result.current.updateEventTime(1, newStart, newEnd);
    });

    expect(mockedEditEvent).toHaveBeenCalledWith(1, {
      start: newStart,
      end: newEnd,
    });
    expect(result.current.events[0].start).toEqual(newStart);
    expect(result.current.events[0].end).toEqual(newEnd);
  });
});

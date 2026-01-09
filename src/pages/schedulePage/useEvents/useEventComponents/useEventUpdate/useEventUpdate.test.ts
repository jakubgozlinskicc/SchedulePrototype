import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEventUpdate } from "./useEventUpdate";
import * as EventDataContext from "../../../../../events/useEvents/useEventDataContext/useEventDataContext";
import type { ChangeEvent } from "react";
import type { Event } from "../../../../../db/scheduleDb";

type ExpectedTarget =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;
type ExpectedEvent = ChangeEvent<ExpectedTarget>;

const createMockEvent = (name: string, value: string): ExpectedEvent => {
  return {
    target: { name, value },
  } as Partial<ExpectedEvent> as ExpectedEvent;
};

describe("useEventUpdate", () => {
  const mockSetEventData = vi.fn();
  const mockSetEvents = vi.fn();
  const mockSetIsDeleteAll = vi.fn();

  const baseEvent: Event = {
    title: "",
    description: "",
    start: new Date("2024-03-15T10:00:00"),
    end: new Date("2024-03-15T11:00:00"),
    color: "#0000FF",
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    vi.spyOn(EventDataContext, "useEventDataContext").mockReturnValue({
      eventData: baseEvent,
      setEventData: mockSetEventData,
      setEvents: mockSetEvents,
      events: [],
      isEditAll: false,
      setIsEditAll: mockSetIsDeleteAll,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("It should initialize with isShaking false", () => {
    const { result } = renderHook(() => useEventUpdate());

    expect(result.current.isShaking).toBe(false);
  });

  it("It should update text fields", () => {
    const { result } = renderHook(() => useEventUpdate());

    const mockEvent = createMockEvent("title", "New Title");

    act(() => {
      result.current.handleChange(mockEvent);
    });

    expect(mockSetEventData).toHaveBeenCalledTimes(1);
    expect(mockSetEventData.mock.calls[0][0]).toBeInstanceOf(Function);
  });

  it("It should use start field handler", () => {
    const { result } = renderHook(() => useEventUpdate());

    const mockEvent = createMockEvent("start", "2024-03-16T10:00");

    act(() => {
      result.current.handleChange(mockEvent);
    });

    expect(mockSetEventData).toHaveBeenCalledTimes(1);

    const updater = mockSetEventData.mock.calls[0][0] as (prev: Event) => Event;

    const updated = updater(baseEvent);
    expect(updated.start.getTime()).toBe(
      new Date("2024-03-16T10:00").getTime()
    );
  });

  it("It should adjust end when start is set after current end", () => {
    const { result } = renderHook(() => useEventUpdate());

    const mockEvent = createMockEvent("start", "2024-03-15T12:00");

    act(() => {
      result.current.handleChange(mockEvent);
    });

    const updater = mockSetEventData.mock.calls[0][0] as (prev: Event) => Event;

    const updated = updater(baseEvent);

    expect(updated.start.getTime()).toBe(
      new Date("2024-03-15T12:00").getTime()
    );
    expect(updated.end.getTime()).toBe(new Date("2024-03-15T12:00").getTime());
  });

  it("It should trigger shake when end is set before start", () => {
    const { result } = renderHook(() => useEventUpdate());

    const mockEvent = createMockEvent("end", "2024-03-15T09:00");

    act(() => {
      result.current.handleChange(mockEvent);
    });

    const updater = mockSetEventData.mock.calls[0][0] as (prev: Event) => Event;

    act(() => {
      const updated = updater(baseEvent);
      expect(updated.end.getTime()).toBe(baseEvent.start.getTime());
    });

    expect(result.current.isShaking).toBe(true);

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.isShaking).toBe(false);
  });

  it("It should handle description change", () => {
    const { result } = renderHook(() => useEventUpdate());

    const mockEvent = createMockEvent("description", "New description");

    act(() => {
      result.current.handleChange(mockEvent);
    });

    const updater = mockSetEventData.mock.calls[0][0] as (prev: Event) => Event;

    const updated = updater(baseEvent);

    expect(updated.description).toBe("New description");
  });

  it("It should handle color change", () => {
    const { result } = renderHook(() => useEventUpdate());

    const mockEvent = createMockEvent("color", "#FF0000");

    act(() => {
      result.current.handleChange(mockEvent);
    });

    const updater = mockSetEventData.mock.calls[0][0] as (prev: Event) => Event;

    const updated = updater(baseEvent);

    expect(updated.color).toBe("#FF0000");
  });
});

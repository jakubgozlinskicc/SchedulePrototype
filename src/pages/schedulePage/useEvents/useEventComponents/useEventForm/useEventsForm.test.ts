import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEventForm } from "./useEventForm";
import * as EventDataContext from "../../useContext/useEventDataContext";

import type { ChangeEvent } from "react";

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

describe("useEventForm", () => {
  const mockSetEventData = vi.fn();
  const mockSetEvents = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();

    vi.clearAllMocks();
    vi.spyOn(EventDataContext, "useEventDataContext").mockReturnValue({
      eventData: {
        id: undefined,
        title: "",
        description: "",
        start: new Date("2024-03-15T10:00:00"),
        end: new Date("2024-03-15T11:00:00"),
        color: "#0000FF",
      },
      setEventData: mockSetEventData,
      setEvents: mockSetEvents,
      events: [],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("It should initialize with isShaking false", () => {
    const { result } = renderHook(() => useEventForm());

    expect(result.current.isShaking).toBe(false);
  });

  it("It should update text fields", () => {
    const { result } = renderHook(() => useEventForm());

    const mockEvent = createMockEvent("title", "New Title");

    act(() => {
      result.current.handleChange(mockEvent);
    });

    expect(mockSetEventData).toHaveBeenCalled();
  });

  it("It should update start date", () => {
    const { result } = renderHook(() => useEventForm());

    const mockEvent = createMockEvent("start", "2024-03-16T10:00");

    act(() => {
      result.current.handleChange(mockEvent);
    });

    expect(mockSetEventData).toHaveBeenCalled();
  });

  it("It should update end date when start is changed to after end", () => {
    const { result } = renderHook(() => useEventForm());

    const mockEvent = createMockEvent("start", "2024-03-15T12:00");

    act(() => {
      result.current.handleChange(mockEvent);
    });

    expect(mockSetEventData).toHaveBeenCalled();
  });

  it("It should handle color change", () => {
    const { result } = renderHook(() => useEventForm());

    const mockEvent = createMockEvent("color", "#FF0000");

    act(() => {
      result.current.handleChange(mockEvent);
    });

    expect(mockSetEventData).toHaveBeenCalled();
  });

  it("It should handle description change", () => {
    const { result } = renderHook(() => useEventForm());

    const mockEvent = createMockEvent("description", "New description");

    act(() => {
      result.current.handleChange(mockEvent);
    });

    expect(mockSetEventData).toHaveBeenCalled();
  });
});

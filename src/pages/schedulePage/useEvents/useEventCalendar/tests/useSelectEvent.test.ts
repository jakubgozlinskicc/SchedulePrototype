import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSelectEvent } from "../useSelectEvent";
import * as EventDataContext from "../../useContext/useEventDataContext";
import type { Event } from "../../../../../db/scheduleDb";

describe("useSelectEvent", () => {
  const mockOpenModal = vi.fn();
  const mockClearHover = vi.fn();
  const mockSetEventData = vi.fn();

  const mockEventData = {
    id: 1,
    title: "test",
    description: "test",
    start: new Date(),
    end: new Date(),
    color: "#0000FF",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(EventDataContext, "useEventDataContext").mockReturnValue({
      eventData: mockEventData,
      setEventData: mockSetEventData,
    });
  });
  it("should handle event selection", () => {
    const { result } = renderHook(() =>
      useSelectEvent(mockOpenModal, mockClearHover)
    );

    const selectedEvent: Event = {
      id: 1,
      title: "test",
      description: "test",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
    };

    act(() => {
      result.current.handleSelectEvent(selectedEvent);
    });

    expect(mockClearHover).toBeCalled();
    expect(mockSetEventData).toBeCalled();
    expect(mockOpenModal).toBeCalled();
  });

  it("should return current event data", () => {
    const { result } = renderHook(() =>
      useSelectEvent(mockOpenModal, mockClearHover)
    );

    expect(result.current.eventData).toBe(mockEventData);
  });
});

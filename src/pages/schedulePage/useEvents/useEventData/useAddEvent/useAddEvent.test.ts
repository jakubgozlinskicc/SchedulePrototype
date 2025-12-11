import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAddEvent } from "./useAddEvent";
import * as EventDataContext from "../../useContext/useEventDataContext";

describe("useAddEvent", () => {
  const mockOpenModal = vi.fn();
  const mockSetEventData = vi.fn();
  const mockSetEvents = vi.fn();

  const mockEventData = {
    id: undefined,
    title: "",
    description: "",
    start: new Date(),
    end: new Date(),
    color: "#0000FF",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(EventDataContext, "useEventDataContext").mockReturnValue({
      eventData: mockEventData,
      setEventData: mockSetEventData,
      setEvents: mockSetEvents,
      events: [],
    });
  });

  it("It should handle add event", () => {
    const { result } = renderHook(() => useAddEvent(mockOpenModal));

    act(() => {
      result.current.handleAddEvent();
    });
    expect(mockOpenModal).toHaveBeenCalled();
  });
});

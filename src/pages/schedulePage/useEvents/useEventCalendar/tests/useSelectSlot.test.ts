import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSelectSlot } from "../useSelectSlot";
import * as EventDataContext from "../../useContext/useEventDataContext";
import type { SlotInfo } from "react-big-calendar";

describe("useSelectSlot", () => {
  const mockOpenModal = vi.fn();
  const mockSetEventData = vi.fn();

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
    });
  });

  it("It should handle slot selection ", () => {
    const { result } = renderHook(() => useSelectSlot(mockOpenModal));

    const slotInfo: SlotInfo = {
      start: new Date("2024-03-15T10:00:00"),
      end: new Date("2024-03-15T11:00:00"),
      slots: [],
      action: "select",
    };

    act(() => {
      result.current.handleSelectSlot(slotInfo);
    });

    expect(mockSetEventData).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "",
        description: "",
        start: slotInfo.start,
        end: slotInfo.end,
        color: "#0000FF",
      })
    );
    expect(mockOpenModal).toHaveBeenCalled();
  });

  it("It should return current eventData", () => {
    const { result } = renderHook(() => useSelectSlot(mockOpenModal));

    expect(result.current.eventData).toBe(mockEventData);
  });
});

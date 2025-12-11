import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEventDropResize } from "../useEventDropResize";

describe("useEventDropResize", () => {
  const mockUpdateEventTime = vi.fn().mockResolvedValue(undefined);
  const mockEvent = {
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

  it("It should handle event drop with date objects", async () => {
    const { result } = renderHook(() =>
      useEventDropResize(mockUpdateEventTime)
    );

    const newStart = new Date("");
    const newEnd = new Date("");

    await act(async () => {
      await result.current.handleEventDropResize({
        event: mockEvent,
        start: newStart,
        end: newEnd,
      });
    });

    expect(mockUpdateEventTime).toHaveBeenCalledWith(1, newStart, newEnd);
  });

  it("it should not call update for event without id", async () => {
    const { result } = renderHook(() =>
      useEventDropResize(mockUpdateEventTime)
    );

    const eventWithoutId = { ...mockEvent, id: undefined };

    await act(async () => {
      await result.current.handleEventDropResize({
        event: eventWithoutId,
        start: mockEvent.start,
        end: mockEvent.end,
      });
    });

    expect(mockUpdateEventTime).toBeCalledTimes(0);
  });
});

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEventHover } from "../useEventHover";
import type { Event } from "../../../../../db/scheduleDb";
import type React from "react";

const mockEvent: Event = {
  id: 1,
  title: "Test Event",
  description: "Test Description",
  start: new Date("2024-03-15T10:00:00"),
  end: new Date("2024-03-15T11:00:00"),
  color: "#0000FF",
};

const createMockMouseEvent = (
  x: number,
  y: number
): React.MouseEvent<HTMLElement> => {
  return {
    clientX: x,
    clientY: y,
  } as React.MouseEvent<HTMLElement>;
};

describe("useEventHover", () => {
  it("It should initialize with null hovered event", () => {
    const { result } = renderHook(() => useEventHover());

    expect(result.current.hoveredEvent).toBeNull();
  });

  it("It should set hovered event and position on mouse enter", () => {
    const { result } = renderHook(() => useEventHover());

    const mockMouseEvent = createMockMouseEvent(100, 200);

    act(() => {
      result.current.handleMouseEnterEvent(mockEvent, mockMouseEvent);
    });

    expect(result.current.hoveredEvent).toBe(mockEvent);
    expect(result.current.hoverPosition).toEqual({ x: 100, y: 200 });
  });

  it("It should clear hovered event", () => {
    const { result } = renderHook(() => useEventHover());

    const mockMouseEvent = createMockMouseEvent(100, 200);

    act(() => {
      result.current.handleMouseEnterEvent(mockEvent, mockMouseEvent);
    });

    expect(result.current.hoveredEvent).toBe(mockEvent);

    act(() => {
      result.current.clearHover();
    });

    expect(result.current.hoveredEvent).toBeNull();
  });

  it("It should update position on multiple mouse enters", () => {
    const { result } = renderHook(() => useEventHover());

    act(() => {
      result.current.handleMouseEnterEvent(
        mockEvent,
        createMockMouseEvent(100, 200)
      );
    });

    expect(result.current.hoverPosition).toEqual({ x: 100, y: 200 });

    act(() => {
      result.current.handleMouseEnterEvent(
        mockEvent,
        createMockMouseEvent(300, 400)
      );
    });

    expect(result.current.hoverPosition).toEqual({ x: 300, y: 400 });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEventDropResize } from "./useEventDropResize";
import type { Event } from "../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../../../events/useEvents/IEventRepository";
import { DropResizeStrategyRegistry } from "./dropResizeStrategies.ts/dropResizeStrategyRegistry";

const mockReloadEvents = vi.fn();

vi.mock(
  "../../../../../events/useEvents/useEventData/useReloadEvents/useReloadEvents",
  () => ({
    useReloadEvents: () => ({
      reloadEvents: mockReloadEvents,
    }),
  })
);

vi.mock("./dropResizeStrategies.ts/dropResizeStrategyRegistry", () => ({
  DropResizeStrategyRegistry: {
    executeDropResize: vi.fn().mockResolvedValue(undefined),
  },
}));

describe("useEventDropResize", () => {
  let mockRepository: IEventRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReloadEvents.mockResolvedValue(undefined);

    mockRepository = {
      addEvent: vi.fn().mockResolvedValue(1),
      getEvents: vi.fn().mockResolvedValue([]),
      getEventById: vi.fn().mockResolvedValue(null),
      editEvent: vi.fn().mockResolvedValue(undefined),
      deleteEvent: vi.fn().mockResolvedValue(undefined),
      clearEvents: vi.fn().mockResolvedValue(undefined),
    };
  });

  it("should call DropResizeStrategyRegistry.executeDropResize with correct parameters", async () => {
    const eventData: Event = {
      id: 1,
      title: "Test event",
      description: "Test",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
    };

    const newStart = new Date("2025-12-15T14:00:00");
    const newEnd = new Date("2025-12-15T15:00:00");

    const { result } = renderHook(() => useEventDropResize(mockRepository));

    await act(async () => {
      await result.current.handleEventDropResize({
        event: eventData,
        start: newStart,
        end: newEnd,
      });
    });

    expect(DropResizeStrategyRegistry.executeDropResize).toHaveBeenCalledWith(
      eventData,
      newStart,
      newEnd,
      mockRepository
    );
  });

  it("should convert string dates to Date objects", async () => {
    const eventData: Event = {
      id: 1,
      title: "Test event",
      description: "Test",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
    };

    const { result } = renderHook(() => useEventDropResize(mockRepository));

    await act(async () => {
      await result.current.handleEventDropResize({
        event: eventData,
        start: "2025-12-15T14:00:00",
        end: "2025-12-15T15:00:00",
      });
    });

    expect(DropResizeStrategyRegistry.executeDropResize).toHaveBeenCalledWith(
      eventData,
      new Date("2025-12-15T14:00:00"),
      new Date("2025-12-15T15:00:00"),
      mockRepository
    );
  });

  it("should reload events after successful drop/resize", async () => {
    const eventData: Event = {
      id: 1,
      title: "Test event",
      description: "Test",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
    };

    const { result } = renderHook(() => useEventDropResize(mockRepository));

    await act(async () => {
      await result.current.handleEventDropResize({
        event: eventData,
        start: new Date("2025-12-15T14:00:00"),
        end: new Date("2025-12-15T15:00:00"),
      });
    });

    expect(mockReloadEvents).toHaveBeenCalledTimes(1);
  });

  it("should not reload events when strategy throws error", async () => {
    (
      DropResizeStrategyRegistry.executeDropResize as ReturnType<typeof vi.fn>
    ).mockRejectedValue(new Error("Strategy error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const eventData: Event = {
      id: 1,
      title: "Test event",
      description: "Test",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
    };

    const { result } = renderHook(() => useEventDropResize(mockRepository));

    await act(async () => {
      await result.current.handleEventDropResize({
        event: eventData,
        start: new Date("2025-12-15T14:00:00"),
        end: new Date("2025-12-15T15:00:00"),
      });
    });

    expect(mockReloadEvents).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error during droping or resizing event:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("should execute operations in correct order", async () => {
    const callOrder: string[] = [];

    (
      DropResizeStrategyRegistry.executeDropResize as ReturnType<typeof vi.fn>
    ).mockImplementation(async () => {
      callOrder.push("executeDropResize");
    });

    mockReloadEvents.mockImplementation(async () => {
      callOrder.push("reloadEvents");
    });

    const eventData: Event = {
      id: 1,
      title: "Test event",
      description: "Test",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
    };

    const { result } = renderHook(() => useEventDropResize(mockRepository));

    await act(async () => {
      await result.current.handleEventDropResize({
        event: eventData,
        start: new Date("2025-12-15T14:00:00"),
        end: new Date("2025-12-15T15:00:00"),
      });
    });

    expect(callOrder).toEqual(["executeDropResize", "reloadEvents"]);
  });
});

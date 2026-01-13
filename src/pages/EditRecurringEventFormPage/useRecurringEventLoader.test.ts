import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useRecurringEventLoader } from "./useRecurringEventLoader";
import type { Event } from "../../db/scheduleDb";
import type { IEventRepository } from "../../events/IEventRepository";

vi.mock(
  "../../events/useEvents/useEventData/useReloadEvents/dateRange",
  () => ({
    getDefaultDateRange: vi.fn(() => ({
      start: new Date("2025-12-01"),
      end: new Date("2025-12-31"),
    })),
  })
);

vi.mock(
  "../../events/useEvents/useEventData/useReloadEvents/occurenceExpander",
  () => ({
    expandRecurringEvent: vi.fn((parent) => [
      {
        ...parent,
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
      },
      {
        ...parent,
        start: new Date("2025-12-11T10:00:00"),
        end: new Date("2025-12-11T11:00:00"),
      },
    ]),
  })
);

describe("useRecurringEventLoader", () => {
  let mockRepository: IEventRepository;

  const mockParentEvent: Event = {
    id: 5,
    title: "Parent Event",
    description: "Test",
    start: new Date("2025-12-10T10:00:00"),
    end: new Date("2025-12-10T11:00:00"),
    color: "#0000FF",
    recurrenceRule: { type: "daily", interval: 1 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = {
      addEvent: vi.fn().mockResolvedValue(1),
      getEvents: vi.fn().mockResolvedValue([]),
      getEventById: vi.fn().mockResolvedValue(mockParentEvent),
      editEvent: vi.fn().mockResolvedValue(undefined),
      deleteEvent: vi.fn().mockResolvedValue(undefined),
      clearEvents: vi.fn().mockResolvedValue(undefined),
    };
  });

  it("should return undefined event when parentId is undefined", async () => {
    const { result } = renderHook(() =>
      useRecurringEventLoader(
        undefined,
        new Date("2025-12-10T10:00:00"),
        mockRepository
      )
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.event).toBeUndefined();
  });

  it("should load occurrence from recurring parent", async () => {
    const occurrenceDate = new Date("2025-12-10T10:00:00");

    const { result } = renderHook(() =>
      useRecurringEventLoader(5, occurrenceDate, mockRepository)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.event).toBeDefined();
    expect(result.current.event?.start.getTime()).toBe(
      occurrenceDate.getTime()
    );
  });

  it("should return undefined when parent has no recurrence rule", async () => {
    mockRepository.getEventById = vi.fn().mockResolvedValue({
      ...mockParentEvent,
      recurrenceRule: { type: "none", interval: 0 },
    });

    const { result } = renderHook(() =>
      useRecurringEventLoader(
        5,
        new Date("2025-12-10T10:00:00"),
        mockRepository
      )
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.event).toBeUndefined();
  });

  it("should start with loading true", () => {
    const { result } = renderHook(() =>
      useRecurringEventLoader(
        5,
        new Date("2025-12-10T10:00:00"),
        mockRepository
      )
    );

    expect(result.current.loading).toBe(true);
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { findNextVirtualInstance } from "./findNextVirtualInstance";
import type { Event } from "../../../../db/scheduleDb";
import { RecurrenceStrategyRegistry } from "../../../recurrence/strategies/recurrenceStrategyRegistry";
import type { IEventRepository } from "../../IEventRepository";

vi.mock("../../../recurrence/strategies/recurrenceStrategyRegistry", () => ({
  RecurrenceStrategyRegistry: {
    generateOccurrences: vi.fn().mockReturnValue([]),
  },
}));

describe("findNextVirtualInstance", () => {
  let mockRepository: IEventRepository;

  beforeEach(() => {
    vi.clearAllMocks();

    mockRepository = {
      addEvent: vi.fn().mockResolvedValue(1),
      getEvents: vi.fn().mockResolvedValue([]),
      getEventById: vi.fn().mockResolvedValue(null),
      editEvent: vi.fn().mockResolvedValue(undefined),
      deleteEvent: vi.fn().mockResolvedValue(undefined),
      clearEvents: vi.fn().mockResolvedValue(undefined),
    };
  });

  it("should return null when parent event is not found", async () => {
    mockRepository.getEventById = vi.fn().mockResolvedValue(null);

    const result = await findNextVirtualInstance(mockRepository, 1);

    expect(result).toBeNull();
    expect(mockRepository.getEventById).toHaveBeenCalledWith(1);
  });

  it("should return null when parent event has no recurrence", async () => {
    const parentEvent: Event = {
      id: 1,
      title: "Non-recurring event",
      description: "Test",
      start: new Date("2025-12-01T10:00:00"),
      end: new Date("2025-12-01T11:00:00"),
      color: "#0000FF",
      recurrenceRule: {
        type: "none",
        interval: 1,
      },
    };

    mockRepository.getEventById = vi.fn().mockResolvedValue(parentEvent);

    const result = await findNextVirtualInstance(mockRepository, 1);

    expect(result).toBeNull();
  });

  it("should call generateOccurrences with correct parameters", async () => {
    const parentEvent: Event = {
      id: 1,
      title: "Recurring event",
      description: "Test",
      start: new Date("2025-12-01T10:00:00"),
      end: new Date("2025-12-01T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1 },
    };

    mockRepository.getEventById = vi.fn().mockResolvedValue(parentEvent);

    const afterDate = new Date("2025-12-10T10:00:00");

    await findNextVirtualInstance(mockRepository, 1, afterDate);

    expect(RecurrenceStrategyRegistry.generateOccurrences).toHaveBeenCalledWith(
      parentEvent,
      afterDate,
      expect.any(Date)
    );

    const rangeEnd = (
      RecurrenceStrategyRegistry.generateOccurrences as ReturnType<typeof vi.fn>
    ).mock.calls[0][2];
    expect(rangeEnd.getFullYear()).toBe(afterDate.getFullYear() + 2);
  });

  it("should return first occurrence after afterDate", async () => {
    const parentEvent: Event = {
      id: 1,
      title: "Recurring event",
      description: "Test",
      start: new Date("2025-12-01T10:00:00"),
      end: new Date("2025-12-01T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1 },
    };

    const afterDate = new Date("2025-12-10T10:00:00");

    const occurrences: Event[] = [
      {
        ...parentEvent,
        start: new Date("2025-12-09T10:00:00"),
        end: new Date("2025-12-09T11:00:00"),
      },
      {
        ...parentEvent,
        start: new Date("2025-12-11T10:00:00"),
        end: new Date("2025-12-11T11:00:00"),
      },
      {
        ...parentEvent,
        start: new Date("2025-12-12T10:00:00"),
        end: new Date("2025-12-12T11:00:00"),
      },
    ];

    mockRepository.getEventById = vi.fn().mockResolvedValue(parentEvent);
    (
      RecurrenceStrategyRegistry.generateOccurrences as ReturnType<typeof vi.fn>
    ).mockReturnValue(occurrences);

    const result = await findNextVirtualInstance(mockRepository, 1, afterDate);

    expect(result).toEqual({
      index: 1,
      event: occurrences[1],
    });
  });

  it("should skip cancelled occurrences", async () => {
    const parentEvent: Event = {
      id: 1,
      title: "Recurring event",
      description: "Test",
      start: new Date("2025-12-01T10:00:00"),
      end: new Date("2025-12-01T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1 },
      cancelledDates: [new Date("2025-12-11T10:00:00").getTime()],
    };

    const afterDate = new Date("2025-12-10T10:00:00");

    const occurrences: Event[] = [
      {
        ...parentEvent,
        start: new Date("2025-12-11T10:00:00"),
        end: new Date("2025-12-11T11:00:00"),
      },
      {
        ...parentEvent,
        start: new Date("2025-12-12T10:00:00"),
        end: new Date("2025-12-12T11:00:00"),
      },
    ];

    mockRepository.getEventById = vi.fn().mockResolvedValue(parentEvent);
    (
      RecurrenceStrategyRegistry.generateOccurrences as ReturnType<typeof vi.fn>
    ).mockReturnValue(occurrences);

    const result = await findNextVirtualInstance(mockRepository, 1, afterDate);

    expect(result).toEqual({
      index: 1,
      event: occurrences[1],
    });
  });

  it("should return null when no valid occurrences found", async () => {
    const parentEvent: Event = {
      id: 1,
      title: "Recurring event",
      description: "Test",
      start: new Date("2025-12-01T10:00:00"),
      end: new Date("2025-12-01T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1 },
    };

    const afterDate = new Date("2025-12-10T10:00:00");

    const occurrences: Event[] = [
      {
        ...parentEvent,
        start: new Date("2025-12-08T10:00:00"),
        end: new Date("2025-12-08T11:00:00"),
      },
      {
        ...parentEvent,
        start: new Date("2025-12-09T10:00:00"),
        end: new Date("2025-12-09T11:00:00"),
      },
    ];

    mockRepository.getEventById = vi.fn().mockResolvedValue(parentEvent);
    (
      RecurrenceStrategyRegistry.generateOccurrences as ReturnType<typeof vi.fn>
    ).mockReturnValue(occurrences);

    const result = await findNextVirtualInstance(mockRepository, 1, afterDate);

    expect(result).toBeNull();
  });

  it("should return null when all occurrences after afterDate are cancelled", async () => {
    const cancelledDate = new Date("2025-12-11T10:00:00");

    const parentEvent: Event = {
      id: 1,
      title: "Recurring event",
      description: "Test",
      start: new Date("2025-12-01T10:00:00"),
      end: new Date("2025-12-01T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1 },
      cancelledDates: [cancelledDate.getTime()],
    };

    const afterDate = new Date("2025-12-10T10:00:00");

    const occurrences: Event[] = [
      {
        ...parentEvent,
        start: cancelledDate,
        end: new Date("2025-12-11T11:00:00"),
      },
    ];

    mockRepository.getEventById = vi.fn().mockResolvedValue(parentEvent);
    (
      RecurrenceStrategyRegistry.generateOccurrences as ReturnType<typeof vi.fn>
    ).mockReturnValue(occurrences);

    const result = await findNextVirtualInstance(mockRepository, 1, afterDate);

    expect(result).toBeNull();
  });

  it("should use current date as default afterDate", async () => {
    const parentEvent: Event = {
      id: 1,
      title: "Recurring event",
      description: "Test",
      start: new Date("2025-12-01T10:00:00"),
      end: new Date("2025-12-01T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1 },
    };

    mockRepository.getEventById = vi.fn().mockResolvedValue(parentEvent);

    const beforeCall = new Date();
    await findNextVirtualInstance(mockRepository, 1);
    const afterCall = new Date();

    const rangeStart = (
      RecurrenceStrategyRegistry.generateOccurrences as ReturnType<typeof vi.fn>
    ).mock.calls[0][1];

    expect(rangeStart.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime());
    expect(rangeStart.getTime()).toBeLessThanOrEqual(afterCall.getTime());
  });

  it("should handle parent event without cancelledDates array", async () => {
    const parentEvent: Event = {
      id: 1,
      title: "Recurring event",
      description: "Test",
      start: new Date("2025-12-01T10:00:00"),
      end: new Date("2025-12-01T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1 },
    };

    const afterDate = new Date("2025-12-10T10:00:00");

    const occurrences: Event[] = [
      {
        ...parentEvent,
        start: new Date("2025-12-11T10:00:00"),
        end: new Date("2025-12-11T11:00:00"),
      },
    ];

    mockRepository.getEventById = vi.fn().mockResolvedValue(parentEvent);
    (
      RecurrenceStrategyRegistry.generateOccurrences as ReturnType<typeof vi.fn>
    ).mockReturnValue(occurrences);

    const result = await findNextVirtualInstance(mockRepository, 1, afterDate);

    expect(result).toEqual({
      index: 0,
      event: occurrences[0],
    });
  });

  it("should handle error and return null", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    mockRepository.getEventById = vi
      .fn()
      .mockRejectedValue(new Error("Database error"));

    const result = await findNextVirtualInstance(mockRepository, 1);

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error finding next instance:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("should return correct index for occurrence deep in the list", async () => {
    const parentEvent: Event = {
      id: 1,
      title: "Recurring event",
      description: "Test",
      start: new Date("2025-12-01T10:00:00"),
      end: new Date("2025-12-01T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1 },
      cancelledDates: [
        new Date("2025-12-11T10:00:00").getTime(),
        new Date("2025-12-12T10:00:00").getTime(),
      ],
    };

    const afterDate = new Date("2025-12-10T10:00:00");

    const occurrences: Event[] = [
      {
        ...parentEvent,
        start: new Date("2025-12-11T10:00:00"),
        end: new Date("2025-12-11T11:00:00"),
      },
      {
        ...parentEvent,
        start: new Date("2025-12-12T10:00:00"),
        end: new Date("2025-12-12T11:00:00"),
      },
      {
        ...parentEvent,
        start: new Date("2025-12-13T10:00:00"),
        end: new Date("2025-12-13T11:00:00"),
      },
    ];

    mockRepository.getEventById = vi.fn().mockResolvedValue(parentEvent);
    (
      RecurrenceStrategyRegistry.generateOccurrences as ReturnType<typeof vi.fn>
    ).mockReturnValue(occurrences);

    const result = await findNextVirtualInstance(mockRepository, 1, afterDate);

    expect(result).toEqual({
      index: 2,
      event: occurrences[2],
    });
  });
});

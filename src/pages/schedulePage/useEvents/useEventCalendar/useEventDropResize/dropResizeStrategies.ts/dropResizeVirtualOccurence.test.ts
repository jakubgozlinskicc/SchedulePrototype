import { beforeEach, describe, expect, it, vi } from "vitest";
import { DropResizeVirtualOccurrenceStrategy } from "./dropResizeVirtualOccurenceStrategy";
import type { Event } from "../../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../../../../events/useEvents/IEventRepository";

describe("dropResizeVirtualOccurence", () => {
  let strategy: DropResizeVirtualOccurrenceStrategy;
  let mockRepository: IEventRepository;

  beforeEach(() => {
    strategy = new DropResizeVirtualOccurrenceStrategy();
    mockRepository = {
      addEvent: vi.fn().mockResolvedValue(1),
      getEvents: vi.fn().mockResolvedValue([]),
      getEventById: vi.fn().mockResolvedValue(null),
      editEvent: vi.fn().mockResolvedValue(undefined),
      deleteEvent: vi.fn().mockResolvedValue(undefined),
      clearEvents: vi.fn().mockResolvedValue(undefined),
    };
  });
  describe("canExecute", () => {
    it("should return true for virtual occurrence without id", () => {
      const eventData: Event = {
        title: "Virtual occurrence",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#FFD7D7",
        recurringEventId: 5,
        recurrenceRule: {
          type: "none",
          interval: 1,
        },
      };
      expect(strategy.canExecute(eventData)).toBe(true);
    });
    it("should return false for regular event", () => {
      const eventData: Event = {
        title: "Regular event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#FFD7D7",
        recurringEventId: undefined,
        recurrenceRule: {
          type: "none",
          interval: 1,
        },
      };
      expect(strategy.canExecute(eventData)).toBe(false);
    });
    it("should return false for parent event with id", () => {
      const eventData: Event = {
        id: 1,
        title: "Parent recurring event",
        description: "Test",
        start: new Date("2025-12-13T10:00:00"),
        end: new Date("2025-12-13T11:33"),
        color: "#FFD7D7",
        recurringEventId: undefined,
        recurrenceRule: {
          type: "none",
          interval: 1,
        },
      };
      expect(strategy.canExecute(eventData)).toBe(false);
    });
  });
  describe("execute", () => {
    it("should throw error when parent event is not found", async () => {
      const eventData: Event = {
        title: "Virtual occurrence",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurringEventId: 999,
      };

      const newStart = new Date("2025-12-15T14:00:00");
      const newEnd = new Date("2025-12-15T15:00:00");

      mockRepository.getEventById = vi.fn().mockResolvedValue(null);

      await expect(
        strategy.execute(eventData, newStart, newEnd, mockRepository)
      ).rejects.toThrow("Parent event not found");
    });

    it("should add cancelled date to parent event", async () => {
      const parentEvent: Event = {
        id: 5,
        title: "Parent event",
        description: "Parent",
        start: new Date("2025-12-01T10:00:00"),
        end: new Date("2025-12-01T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "daily", interval: 1 },
        cancelledDates: [],
      };

      const eventData: Event = {
        title: "Virtual occurrence",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurringEventId: 5,
      };

      const newStart = new Date("2025-12-15T14:00:00");
      const newEnd = new Date("2025-12-15T15:00:00");

      mockRepository.getEventById = vi.fn().mockResolvedValue(parentEvent);

      await strategy.execute(eventData, newStart, newEnd, mockRepository);

      expect(mockRepository.editEvent).toHaveBeenCalledWith(5, {
        cancelledDates: [new Date("2025-12-10T10:00:00").getTime()],
      });
    });

    it("should use originalStart for cancellation if available", async () => {
      const parentEvent: Event = {
        id: 5,
        title: "Parent event",
        description: "Parent",
        start: new Date("2025-12-01T10:00:00"),
        end: new Date("2025-12-01T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "daily", interval: 1 },
        cancelledDates: [],
      };

      const originalStartDate = new Date("2025-12-08T10:00:00");
      const eventData: Event = {
        title: "Virtual occurrence",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurringEventId: 5,
        originalStart: originalStartDate,
      };

      const newStart = new Date("2025-12-15T14:00:00");
      const newEnd = new Date("2025-12-15T15:00:00");

      mockRepository.getEventById = vi.fn().mockResolvedValue(parentEvent);

      await strategy.execute(eventData, newStart, newEnd, mockRepository);

      expect(mockRepository.editEvent).toHaveBeenCalledWith(5, {
        cancelledDates: [originalStartDate.getTime()],
      });
    });

    it("should append to existing cancelledDates", async () => {
      const existingCancelledDate = new Date("2025-12-05T10:00:00").getTime();
      const parentEvent: Event = {
        id: 5,
        title: "Parent event",
        description: "Parent",
        start: new Date("2025-12-01T10:00:00"),
        end: new Date("2025-12-01T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "daily", interval: 1 },
        cancelledDates: [existingCancelledDate],
      };

      const eventData: Event = {
        title: "Virtual occurrence",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurringEventId: 5,
      };

      const newStart = new Date("2025-12-15T14:00:00");
      const newEnd = new Date("2025-12-15T15:00:00");

      mockRepository.getEventById = vi.fn().mockResolvedValue(parentEvent);

      await strategy.execute(eventData, newStart, newEnd, mockRepository);

      expect(mockRepository.editEvent).toHaveBeenCalledWith(5, {
        cancelledDates: [
          existingCancelledDate,
          new Date("2025-12-10T10:00:00").getTime(),
        ],
      });
    });

    it("should add new regular event with new dates", async () => {
      const parentEvent: Event = {
        id: 5,
        title: "Parent event",
        description: "Parent",
        start: new Date("2025-12-01T10:00:00"),
        end: new Date("2025-12-01T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "daily", interval: 1 },
        cancelledDates: [],
      };

      const eventData: Event = {
        title: "Virtual occurrence",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#FF0000",
        recurringEventId: 5,
      };

      const newStart = new Date("2025-12-15T14:00:00");
      const newEnd = new Date("2025-12-15T15:00:00");

      mockRepository.getEventById = vi.fn().mockResolvedValue(parentEvent);

      await strategy.execute(eventData, newStart, newEnd, mockRepository);

      expect(mockRepository.addEvent).toHaveBeenCalledWith({
        ...eventData,
        start: newStart,
        end: newEnd,
        recurrenceRule: { type: "none", interval: 1 },
        recurringEventId: undefined,
      });
    });

    it("should call editEvent before addEvent", async () => {
      const callOrder: string[] = [];

      const parentEvent: Event = {
        id: 5,
        title: "Parent event",
        description: "Parent",
        start: new Date("2025-12-01T10:00:00"),
        end: new Date("2025-12-01T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "daily", interval: 1 },
        cancelledDates: [],
      };

      const eventData: Event = {
        title: "Virtual occurrence",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurringEventId: 5,
      };

      mockRepository.getEventById = vi.fn().mockResolvedValue(parentEvent);
      mockRepository.editEvent = vi.fn().mockImplementation(async () => {
        callOrder.push("editEvent");
      });
      mockRepository.addEvent = vi.fn().mockImplementation(async () => {
        callOrder.push("addEvent");
        return 10;
      });

      const newStart = new Date("2025-12-15T14:00:00");
      const newEnd = new Date("2025-12-15T15:00:00");

      await strategy.execute(eventData, newStart, newEnd, mockRepository);

      expect(callOrder).toEqual(["editEvent", "addEvent"]);
    });
  });
});

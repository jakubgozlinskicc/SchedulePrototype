import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteAllRecurringEventsStrategy } from "./DeleteAllRecurringEventsStrategy";
import type { Event } from "../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";

describe("DeleteAllRecurringEventsStrategy", () => {
  let strategy: DeleteAllRecurringEventsStrategy;
  let mockRepository: IEventRepository;

  beforeEach(() => {
    strategy = new DeleteAllRecurringEventsStrategy();
    mockRepository = {
      addEvent: vi.fn().mockResolvedValue(1),
      getEvents: vi.fn().mockResolvedValue([]),
      getEventById: vi.fn().mockResolvedValue(undefined),
      editEvent: vi.fn().mockResolvedValue(undefined),
      deleteEvent: vi.fn().mockResolvedValue(undefined),
      clearEvents: vi.fn().mockResolvedValue(undefined),
    };
  });

  describe("canExecute", () => {
    it("should return true for recurring parent event with isDeleteAll true", () => {
      const eventData: Event = {
        id: 1,
        title: "Recurring event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: {
          type: "daily",
          interval: 0,
        },
      };

      expect(strategy.canExecute(eventData, { isDeleteAll: true })).toBe(true);
    });

    it("should return true for virtual occurrence with isDeleteAll true", () => {
      const eventData: Event = {
        title: "Virtual occurrence",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurringEventId: 5,
        recurrenceRule: {
          type: "none",
          interval: 0,
        },
      };

      expect(strategy.canExecute(eventData, { isDeleteAll: true })).toBe(true);
    });

    it("should return false when isDeleteAll is false", () => {
      const eventData: Event = {
        id: 1,
        title: "Recurring event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: {
          type: "daily",
          interval: 0,
        },
      };

      expect(strategy.canExecute(eventData, { isDeleteAll: false })).toBe(
        false
      );
    });

    it("should return false for non-recurring event", () => {
      const eventData: Event = {
        id: 1,
        title: "Regular event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: {
          type: "none",
          interval: 0,
        },
      };

      expect(strategy.canExecute(eventData, { isDeleteAll: true })).toBe(false);
    });

    it("should return false when options is undefined", () => {
      const eventData: Event = {
        id: 1,
        title: "Recurring event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: {
          type: "daily",
          interval: 0,
        },
      };

      expect(strategy.canExecute(eventData)).toBe(false);
    });
  });

  describe("execute", () => {
    it("should delete parent event using its own id", async () => {
      const eventData: Event = {
        id: 10,
        title: "Recurring parent",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: {
          type: "daily",
          interval: 0,
        },
      };

      await strategy.execute(eventData, mockRepository);

      expect(mockRepository.deleteEvent).toHaveBeenCalledWith(10);
    });

    it("should delete parent event using recurringEventId for virtual occurrence", async () => {
      const eventData: Event = {
        title: "Virtual occurrence",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurringEventId: 5,
      };

      await strategy.execute(eventData, mockRepository);

      expect(mockRepository.deleteEvent).toHaveBeenCalledWith(5);
    });
  });
});

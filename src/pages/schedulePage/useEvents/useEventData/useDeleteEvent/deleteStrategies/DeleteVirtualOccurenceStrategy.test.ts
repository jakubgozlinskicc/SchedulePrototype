import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Event } from "../../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";
import { DeleteVirtualOccurrenceStrategy } from "./DeleteVirtualOccurrenceStrategy";

describe("DeleteVirtualOccurrenceStrategy", () => {
  let strategy: DeleteVirtualOccurrenceStrategy;
  let mockRepository: IEventRepository;

  beforeEach(() => {
    strategy = new DeleteVirtualOccurrenceStrategy();
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
    it("should return false for regular event", () => {
      const eventData: Event = {
        id: 1,
        title: "Regular event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: {
          type: "none",
          interval: 1,
        },
      };

      expect(strategy.canExecute(eventData, { isDeleteAll: false })).toBe(
        false
      );
    });

    it("should return false for recurring parent event", () => {
      const eventData: Event = {
        id: 1,
        title: "Recurring event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurringEventId: undefined,
        recurrenceRule: {
          type: "daily",
          interval: 1,
        },
      };

      expect(strategy.canExecute(eventData, { isDeleteAll: false })).toBe(
        false
      );
    });

    it("should return true for virtual occurrence", () => {
      const eventData: Event = {
        id: undefined,
        title: "Virtual occurrence",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurringEventId: 1,
        recurrenceRule: {
          type: "daily",
          interval: 1,
        },
      };

      expect(strategy.canExecute(eventData, { isDeleteAll: false })).toBe(true);
    });

    it("should return false for virtual occurrence when isDeleteAll is true", () => {
      const eventData: Event = {
        id: undefined,
        title: "Virtual occurrence",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurringEventId: 1,
        recurrenceRule: {
          type: "daily",
          interval: 1,
        },
      };

      expect(strategy.canExecute(eventData, { isDeleteAll: true })).toBe(false);
    });
  });
  describe("execute", () => {
    it("should append to existing cancelledDates", async () => {
      const existingCancelledDate = new Date("2025-12-05T10:00:00").getTime();
      const parentEvent: Event = {
        id: 5,
        title: "Parent event",
        description: "Test",
        start: new Date("2025-12-01T10:00:00"),
        end: new Date("2025-12-01T11:00:00"),
        color: "#0000FF",
        recurrenceRule: {
          type: "daily",
          interval: 1,
        },
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

      mockRepository.getEvents = vi.fn().mockResolvedValue([parentEvent]);

      await strategy.execute(eventData, mockRepository);

      expect(mockRepository.editEvent).toHaveBeenCalledWith(5, {
        cancelledDates: [
          existingCancelledDate,
          new Date("2025-12-10T10:00:00").getTime(),
        ],
      });
    });

    it("should add start date to cancelledDates of parent event", async () => {
      const parentEvent: Event = {
        id: 5,
        title: "Parent event",
        description: "Test",
        start: new Date("2025-12-01T10:00:00"),
        end: new Date("2025-12-01T11:00:00"),
        color: "#0000FF",
        recurrenceRule: {
          type: "daily",
          interval: 1,
        },
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

      mockRepository.getEvents = vi.fn().mockResolvedValue([parentEvent]);

      await strategy.execute(eventData, mockRepository);

      expect(mockRepository.editEvent).toHaveBeenCalledWith(5, {
        cancelledDates: [new Date("2025-12-10T10:00:00").getTime()],
      });
    });

    it("should not call editEvent when parent event is not found", async () => {
      const eventData: Event = {
        title: "Virtual occurrence",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurringEventId: 999,
      };

      mockRepository.getEvents = vi.fn().mockResolvedValue([]);

      await strategy.execute(eventData, mockRepository);

      expect(mockRepository.editEvent).not.toHaveBeenCalled();
    });
  });
});

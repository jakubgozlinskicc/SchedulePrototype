import { describe, it, expect, vi, beforeEach } from "vitest";
import { DropResizeRegularEventStrategy } from "./dropResizeRegularEventStrategy";
import type { Event } from "../../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";

describe("DropResizeRegularEventStrategy", () => {
  let strategy: DropResizeRegularEventStrategy;
  let mockRepository: IEventRepository;

  beforeEach(() => {
    strategy = new DropResizeRegularEventStrategy();
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
    it("should return true for regular event with id and recurrenceRule type none", () => {
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

      expect(strategy.canExecute(eventData)).toBe(true);
    });

    it("should return false when event has no id", () => {
      const eventData: Event = {
        title: "No id event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: {
          type: "none",
          interval: 1,
        },
      };

      expect(strategy.canExecute(eventData)).toBe(false);
    });

    it("should return false for recurring event", () => {
      const eventData: Event = {
        id: 1,
        title: "Recurring event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "daily", interval: 1 },
      };

      expect(strategy.canExecute(eventData)).toBe(false);
    });

    it("should return false when recurrenceRule is undefined", () => {
      const eventData: Event = {
        id: 1,
        title: "Event without rule",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
      };

      expect(strategy.canExecute(eventData)).toBe(false);
    });
  });

  describe("execute", () => {
    it("should call editEvent with new start and end dates", async () => {
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

      const newStart = new Date("2025-12-15T14:00:00");
      const newEnd = new Date("2025-12-15T15:00:00");

      await strategy.execute(eventData, newStart, newEnd, mockRepository);

      expect(mockRepository.editEvent).toHaveBeenCalledWith(1, {
        start: newStart,
        end: newEnd,
      });
    });

    it("should not call editEvent when event has no id", async () => {
      const eventData: Event = {
        title: "No id event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
      };

      const newStart = new Date("2025-12-15T14:00:00");
      const newEnd = new Date("2025-12-15T15:00:00");

      await strategy.execute(eventData, newStart, newEnd, mockRepository);

      expect(mockRepository.editEvent).not.toHaveBeenCalled();
    });
  });
});

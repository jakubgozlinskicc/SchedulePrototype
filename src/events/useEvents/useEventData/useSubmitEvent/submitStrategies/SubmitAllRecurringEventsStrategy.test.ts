import { beforeEach, describe, expect, it, vi } from "vitest";
import { SubmitAllRecurringEventsStrategy } from "./SubmitAllRecurringEventsStrategy";
import type { Event } from "../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";

describe("SubmitAllRecurringEventsStrategy", () => {
  let strategy: SubmitAllRecurringEventsStrategy;
  let mockRepository: IEventRepository;

  beforeEach(() => {
    strategy = new SubmitAllRecurringEventsStrategy();
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
    it("should return true for recurring event with isEditAll true", () => {
      const eventData: Event = {
        id: 1,
        title: "Recurring event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "daily", interval: 1 },
      };

      expect(strategy.canExecute(eventData, { isEditAll: true })).toBe(true);
    });

    it("should return true for virtual occurrence with isEditAll true", () => {
      const eventData: Event = {
        id: 1,
        title: "Virtual occurrence",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurringEventId: 5,
        recurrenceRule: { type: "none", interval: 1 },
      };

      expect(strategy.canExecute(eventData, { isEditAll: true })).toBe(true);
    });

    it("should return false when isEditAll is false", () => {
      const eventData: Event = {
        id: 1,
        title: "Recurring event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "daily", interval: 1 },
      };

      expect(strategy.canExecute(eventData, { isEditAll: false })).toBe(false);
    });

    it("should return false when isEditAll is undefined", () => {
      const eventData: Event = {
        id: 1,
        title: "Recurring event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "daily", interval: 1 },
      };

      expect(strategy.canExecute(eventData, {})).toBe(false);
    });

    it("should return false for non-recurring event even with isEditAll true", () => {
      const eventData: Event = {
        id: 1,
        title: "Regular event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "none", interval: 1 },
      };

      expect(strategy.canExecute(eventData, { isEditAll: true })).toBe(false);
    });
  });

  describe("execute", () => {
    it("should edit parent event using event id", async () => {
      const eventData: Event = {
        id: 1,
        title: "Recurring event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "daily", interval: 1 },
      };

      await strategy.execute(eventData, mockRepository);

      expect(mockRepository.editEvent).toHaveBeenCalledWith(1, eventData);
    });

    it("should edit parent event using recurringEventId when available", async () => {
      const eventData: Event = {
        id: 10,
        title: "Virtual occurrence",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurringEventId: 5,
        recurrenceRule: { type: "none", interval: 1 },
      };

      await strategy.execute(eventData, mockRepository);

      expect(mockRepository.editEvent).toHaveBeenCalledWith(5, eventData);
    });

    it("should prioritize recurringEventId over id", async () => {
      const eventData: Event = {
        id: 100,
        title: "Virtual occurrence",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurringEventId: 1,
        recurrenceRule: { type: "none", interval: 1 },
      };

      await strategy.execute(eventData, mockRepository);

      expect(mockRepository.editEvent).toHaveBeenCalledWith(1, eventData);
      expect(mockRepository.editEvent).not.toHaveBeenCalledWith(100, eventData);
    });
  });
});

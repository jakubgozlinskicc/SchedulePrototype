import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Event } from "../../../../../../db/scheduleDb";
import { DeleteRegularEventStrategy } from "./DeleteRegularEventStrategy";
import type { IEventRepository } from "../../../IEventRepository";

describe("DeleteRegularEventsStrategy", () => {
  let strategy: DeleteRegularEventStrategy;
  let mockRepository: IEventRepository;

  beforeEach(() => {
    strategy = new DeleteRegularEventStrategy();
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
    it("should return true for regular event", () => {
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

    it("should return false for virtual occurrence", () => {
      const eventData: Event = {
        id: undefined,
        title: "Virtual occurrence",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurringEventId: 5,
        recurrenceRule: {
          type: "daily",
          interval: 1,
        },
      };

      expect(strategy.canExecute(eventData)).toBe(false);
    });

    it("should return false for parent event", () => {
      const eventData: Event = {
        id: 1,
        title: "Parent event",
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

      expect(strategy.canExecute(eventData)).toBe(false);
    });
  });
  describe("execute", () => {
    it("should delete the regular event", async () => {
      const eventData: Event = {
        id: 1,
        title: "Regular event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurringEventId: undefined,
        recurrenceRule: {
          type: "none",
          interval: 1,
        },
      };

      await strategy.execute(eventData, mockRepository);
      expect(mockRepository.deleteEvent).toHaveBeenCalledWith(eventData.id);
    });
  });
});

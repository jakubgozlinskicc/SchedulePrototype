import { beforeEach, describe, expect, it, vi } from "vitest";
import { SubmitNewEventStrategy } from "./SubmitNewEventStrategy";
import type { IEventRepository } from "../../../IEventRepository";
import type { Event } from "../../../../../../db/scheduleDb";

describe("SubmitNewEventStrategy", () => {
  let strategy = new SubmitNewEventStrategy();
  let mockRepository: IEventRepository;
  beforeEach(() => {
    strategy = new SubmitNewEventStrategy();
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
    it("should return true for new event without id", () => {
      const eventData: Event = {
        title: "New event",
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

    it("should return false for existing event with id", () => {
      const eventData: Event = {
        id: 1,
        title: "Existing event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#FFD7D7",
        recurrenceRule: {
          type: "none",
          interval: 1,
        },
      };
      expect(strategy.canExecute(eventData)).toBe(false);
    });

    it("should return false for virtual occurrence without id", () => {
      const eventData: Event = {
        title: "Virtual occurrence",
        description: "Test",
        start: new Date("2025-12-10T10:35"),
        end: new Date("2025-12-13T9"),
        color: "#FFD7D7",
        recurringEventId: 5,
        recurrenceRule: {
          type: "none",
          interval: 1,
        },
      };
      expect(strategy.canExecute(eventData)).toBe(false);
    });

    it("should return false for parent event", () => {
      const eventData: Event = {
        title: "Parent event",
        description: "Test",
        start: new Date("2025-12-9T9"),
        end: new Date("2025-12-9T9"),
        color: "#FFD7D7",
        recurringEventId: undefined,
        recurrenceRule: {
          type: "daily",
          interval: 3,
        },
      };
      expect(strategy.canExecute(eventData)).toBe(false);
    });
  });

  describe("execute", () => {
    it("should add the new event", async () => {
      const eventData: Event = {
        title: "New event",
        description: "Test",
        start: new Date("2025-12-9T9"),
        end: new Date("2025-12-9T9"),
        color: "#FFD7D7",
      };
      await strategy.execute(eventData, mockRepository);

      expect(mockRepository.addEvent).toHaveBeenCalledWith(eventData);
    });
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import { DropResizeParentStrategy } from "./dropResizeParentStrategy";
import type { IEventRepository } from "../../../../../../events/useEvents/IEventRepository";
import type { Event } from "../../../../../../db/scheduleDb";

vi.mock(
  "../../../../../../events/useEvents/useEventData/useRecurringEdit/setNewParentEvent",
  () => ({
    setNewParentEvent: vi.fn().mockResolvedValue(undefined),
  })
);

import { setNewParentEvent } from "../../../../../../events/useEvents/useEventData/useRecurringEdit/setNewParentEvent";

describe("dropResizeParentStrategy", () => {
  let strategy: DropResizeParentStrategy;
  let mockRepository: IEventRepository;
  let start: Date;
  let end: Date;
  beforeEach(() => {
    strategy = new DropResizeParentStrategy();
    start = new Date("2025-12-13T10:00:00");
    end = new Date("2025-12-13T11:00:00");

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
    it("should return true for parent event with id", () => {
      const eventData: Event = {
        id: 1,
        title: "Parent recurring event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: {
          type: "daily",
          interval: 1,
        },
      };
      expect(strategy.canExecute(eventData)).toBe(true);
    });

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
      expect(strategy.canExecute(eventData)).toBe(false);
    });

    it("should return false for virtual occurrence with recurringEventId", () => {
      const eventData: Event = {
        title: "Virtual occurrence",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurringEventId: 5,
        recurrenceRule: {
          type: "none",
          interval: 1,
        },
      };
      expect(strategy.canExecute(eventData)).toBe(false);
    });
  });
  describe("execute", () => {
    it("should call setNewParentEvent and then editEvent", async () => {
      const eventData: Event = {
        id: 1,
        title: "Recurring event",
        description: "Test",
        start: new Date("2025-12-13T10:00:00"),
        end: new Date("2025-12-13T11:00:00"),
        color: "#FFD7D7",
        recurringEventId: undefined,
        recurrenceRule: {
          type: "none",
          interval: 1,
        },
      };
      await strategy.execute(eventData, start, end, mockRepository);
      expect(setNewParentEvent).toHaveBeenCalledWith(mockRepository, eventData);
      expect(mockRepository.editEvent).toHaveBeenCalledWith(1, {
        ...eventData,
        recurrenceRule: { type: "none", interval: 1 },
        cancelledDates: [],
      });
    });
    it("should call editEvent on repository.editEvent with correct parameters", async () => {
      const eventData: Event = {
        id: 1,
        title: "Parent recurring event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: {
          type: "none",
          interval: 1,
        },
        cancelledDates: [],
      };
      await strategy.execute(eventData, start, end, mockRepository);
      expect(mockRepository.editEvent).toHaveBeenCalledWith(1, {
        ...eventData,
        start,
        end,
      });
    });
  });
});

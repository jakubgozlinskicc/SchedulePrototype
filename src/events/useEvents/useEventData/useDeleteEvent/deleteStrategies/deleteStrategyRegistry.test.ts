import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteStrategyRegistry } from "./deleteStrategyRegistry";
import type { Event } from "../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";

vi.mock(
  "../../../useEventComponents/useRecurringEdit/setNewParentEvent",
  () => ({
    setNewParentEvent: vi.fn().mockResolvedValue(undefined),
  })
);

describe("DeleteStrategyRegistry", () => {
  let mockRepository: IEventRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = {
      addEvent: vi.fn().mockResolvedValue(1),
      getEvents: vi.fn().mockResolvedValue([]),
      getEventById: vi.fn().mockResolvedValue(undefined),
      editEvent: vi.fn().mockResolvedValue(undefined),
      deleteEvent: vi.fn().mockResolvedValue(undefined),
      clearEvents: vi.fn().mockResolvedValue(undefined),
    };
  });

  describe("executeDelete", () => {
    it("should use DeleteRegularEventStrategy for regular event", async () => {
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

      await DeleteStrategyRegistry.executeDelete(eventData, mockRepository);

      expect(mockRepository.deleteEvent).toHaveBeenCalledWith(1);
    });

    it("should use DeleteAllRecurringEventsStrategy when isDeleteAll is true", async () => {
      const eventData: Event = {
        id: 5,
        title: "Recurring event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: {
          type: "daily",
          interval: 1,
        },
      };

      await DeleteStrategyRegistry.executeDelete(eventData, mockRepository, {
        isDeleteAll: true,
      });

      expect(mockRepository.deleteEvent).toHaveBeenCalledWith(5);
    });

    it("should use DeleteVirtualOccurrenceStrategy for virtual occurrence", async () => {
      const parentEvent: Event = {
        id: 5,
        title: "Parent",
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

      mockRepository.getEvents = vi.fn().mockResolvedValue([parentEvent]);

      const eventData: Event = {
        title: "Virtual occurrence",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurringEventId: 5,
      };

      await DeleteStrategyRegistry.executeDelete(eventData, mockRepository, {
        isDeleteAll: false,
      });

      expect(mockRepository.editEvent).toHaveBeenCalledWith(5, {
        cancelledDates: [new Date("2025-12-10T10:00:00").getTime()],
      });
      expect(mockRepository.deleteEvent).not.toHaveBeenCalled();
    });

    it("should use DeleteRecurringParentStrategy for recurring parent with isDeleteAll false", async () => {
      const eventData: Event = {
        id: 10,
        title: "Recurring parent",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: {
          type: "daily",
          interval: 1,
        },
      };

      await DeleteStrategyRegistry.executeDelete(eventData, mockRepository, {
        isDeleteAll: false,
      });

      expect(mockRepository.deleteEvent).toHaveBeenCalledWith(10);
    });

    it("should throw error when no strategy matches", async () => {
      const eventData: Event = {
        title: "Weird event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: {
          type: "none",
          interval: 1,
        },
      };

      await expect(
        DeleteStrategyRegistry.executeDelete(eventData, mockRepository)
      ).rejects.toThrow("No delete strategy found for event");
    });

    it("should delete parent via recurringEventId for virtual occurrence with isDeleteAll true", async () => {
      const eventData: Event = {
        title: "Virtual occurrence",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurringEventId: 7,
        recurrenceRule: {
          type: "none",
          interval: 1,
        },
      };

      await DeleteStrategyRegistry.executeDelete(eventData, mockRepository, {
        isDeleteAll: true,
      });

      expect(mockRepository.deleteEvent).toHaveBeenCalledWith(7);
    });
  });
});

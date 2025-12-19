import { describe, it, expect, vi, beforeEach } from "vitest";
import { DropResizeStrategyRegistry } from "./dropResizeStrategyRegistry";
import type { Event } from "../../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";

vi.mock(
  "../../../useEventComponents/useRecurringEdit/setNewParentEvent",
  () => ({
    setNewParentEvent: vi.fn().mockResolvedValue(undefined),
  })
);

describe("DropResizeStrategyRegistry", () => {
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

  describe("executeDropResize", () => {
    it("should use DropResizeRegularEventStrategy for regular event", async () => {
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

      const newStart = new Date("2025-12-15T14:00:00");
      const newEnd = new Date("2025-12-15T15:00:00");

      await DropResizeStrategyRegistry.executeDropResize(
        eventData,
        newStart,
        newEnd,
        mockRepository
      );

      expect(mockRepository.editEvent).toHaveBeenCalledWith(1, {
        start: newStart,
        end: newEnd,
      });
    });

    it("should use DropResizeParentStrategy for recurring parent event", async () => {
      const eventData: Event = {
        id: 1,
        title: "Recurring event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "daily", interval: 1 },
      };

      const newStart = new Date("2025-12-15T14:00:00");
      const newEnd = new Date("2025-12-15T15:00:00");

      await DropResizeStrategyRegistry.executeDropResize(
        eventData,
        newStart,
        newEnd,
        mockRepository
      );

      expect(mockRepository.editEvent).toHaveBeenCalledWith(1, {
        ...eventData,
        start: newStart,
        end: newEnd,
        recurrenceRule: { type: "none", interval: 1 },
        cancelledDates: [],
      });
    });

    it("should use DropResizeVirtualOccurrenceStrategy for virtual occurrence", async () => {
      const parentEvent: Event = {
        id: 5,
        title: "Parent",
        description: "Test",
        start: new Date("2025-12-01T10:00:00"),
        end: new Date("2025-12-01T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "daily", interval: 1 },
        cancelledDates: [],
      };

      mockRepository.getEventById = vi.fn().mockResolvedValue(parentEvent);

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

      await DropResizeStrategyRegistry.executeDropResize(
        eventData,
        newStart,
        newEnd,
        mockRepository
      );

      expect(mockRepository.editEvent).toHaveBeenCalledWith(5, {
        cancelledDates: [new Date("2025-12-10T10:00:00").getTime()],
      });
      expect(mockRepository.addEvent).toHaveBeenCalledWith({
        ...eventData,
        start: newStart,
        end: newEnd,
        recurrenceRule: { type: "none", interval: 1 },
        recurringEventId: undefined,
      });
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
          interval: 0,
        },
      };

      const newStart = new Date("2025-12-15T14:00:00");
      const newEnd = new Date("2025-12-15T15:00:00");

      await expect(
        DropResizeStrategyRegistry.executeDropResize(
          eventData,
          newStart,
          newEnd,
          mockRepository
        )
      ).rejects.toThrow("No drop/resize strategy found for event");
    });
  });
});

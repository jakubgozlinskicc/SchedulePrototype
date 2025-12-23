import { beforeEach, describe, expect, it, vi } from "vitest";
import { SubmitStrategyRegistry } from "./SubmitStrategyRegistry";
import type { Event } from "../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";

vi.mock(
  "../../../useEventComponents/useRecurringEdit/setNewParentEvent",
  () => ({
    setNewParentEvent: vi.fn().mockResolvedValue(undefined),
  })
);

describe("SubmitStrategyRegistry", () => {
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

  describe("executeSubmit", () => {
    it("should use SubmitNewEventStrategy for new event", async () => {
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
      await SubmitStrategyRegistry.executeSubmit(eventData, mockRepository);

      expect(mockRepository.addEvent).toHaveBeenCalledWith(eventData);
    });

    it("should use SubmitExistingEventStrategy for existing event", async () => {
      const eventData: Event = {
        id: 1,
        title: "Existing event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#FF0000",
        recurrenceRule: {
          type: "none",
          interval: 1,
        },
        cancelledDates: [],
      };
      await SubmitStrategyRegistry.executeSubmit(eventData, mockRepository);

      expect(mockRepository.editEvent).toHaveBeenCalledWith(
        eventData.id!,
        eventData
      );
    });

    it("should use SubmitVirtualOccurrenceStrategy for virtual occurrence", async () => {
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
        title: "Modified occurrence",
        description: "Modified",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#FF0000",
        recurringEventId: 5,
      };

      mockRepository.getEventById = vi.fn().mockResolvedValue(parentEvent);

      await SubmitStrategyRegistry.executeSubmit(eventData, mockRepository);

      expect(mockRepository.editEvent).toHaveBeenCalled();
      expect(mockRepository.addEvent).toHaveBeenCalled();
    });

    it("should use SubmitParentStrategy for parent event", async () => {
      const eventData: Event = {
        id: 10,
        title: "Updated Recurring Event",
        description: "Updated Parent",
        start: new Date("2025-12-09T09:00:00"),
        end: new Date("2025-12-09T10:00:00"),
        color: "#00FF00",
        recurrenceRule: { type: "weekly", interval: 1 },
      };
      await SubmitStrategyRegistry.executeSubmit(eventData, mockRepository);
      expect(mockRepository.editEvent).toHaveBeenCalledWith(eventData.id!, {
        ...eventData,
        recurrenceRule: { type: "none", interval: 1 },
        cancelledDates: [],
      });
    });
  });
});

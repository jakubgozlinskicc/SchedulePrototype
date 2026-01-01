import { beforeEach, describe, expect, it, vi } from "vitest";
import { SubmitStrategyRegistry } from "./SubmitStrategyRegistry";
import type { Event } from "../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";

vi.mock("../../useRecurringEdit/setNewParentEvent", () => ({
  setNewParentEvent: vi.fn().mockResolvedValue(undefined),
}));

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
        recurrenceRule: { type: "none", interval: 1 },
      };

      await SubmitStrategyRegistry.executeSubmit(eventData, mockRepository);

      expect(mockRepository.addEvent).toHaveBeenCalledWith(eventData);
    });

    it("should use SubmitExistingEventStrategy for existing non-recurring event", async () => {
      const eventData: Event = {
        id: 1,
        title: "Existing event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#FF0000",
        recurrenceRule: { type: "none", interval: 1 },
      };

      mockRepository.getEventById = vi.fn().mockResolvedValue({
        ...eventData,
        recurrenceRule: { type: "none", interval: 1 },
      });

      await SubmitStrategyRegistry.executeSubmit(eventData, mockRepository, {
        isEditAll: false,
      });

      expect(mockRepository.editEvent).toHaveBeenCalledWith(1, eventData);
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
        recurrenceRule: { type: "none", interval: 1 },
      };

      mockRepository.getEventById = vi.fn().mockResolvedValue(parentEvent);

      await SubmitStrategyRegistry.executeSubmit(eventData, mockRepository);

      expect(mockRepository.getEventById).toHaveBeenCalledWith(5);
      expect(mockRepository.editEvent).toHaveBeenCalledWith(5, {
        cancelledDates: [eventData.start.getTime()],
      });
      expect(mockRepository.addEvent).toHaveBeenCalledWith({
        ...eventData,
        recurrenceRule: { type: "none", interval: 1 },
        recurringEventId: undefined,
      });
    });

    it("should use SubmitAllRecurringEventsStrategy when isEditAll is true", async () => {
      const eventData: Event = {
        id: 10,
        title: "Updated Recurring Event",
        description: "Updated",
        start: new Date("2025-12-09T09:00:00"),
        end: new Date("2025-12-09T10:00:00"),
        color: "#00FF00",
        recurrenceRule: { type: "weekly", interval: 1 },
      };

      await SubmitStrategyRegistry.executeSubmit(eventData, mockRepository, {
        isEditAll: true,
      });

      expect(mockRepository.editEvent).toHaveBeenCalledWith(10, eventData);
    });

    it("should use SubmitAllRecurringEventsStrategy for virtual occurrence with isEditAll true", async () => {
      const eventData: Event = {
        id: 15,
        title: "Updated occurrence",
        description: "Updated",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#FF0000",
        recurringEventId: 5,
        recurrenceRule: { type: "none", interval: 1 },
      };

      await SubmitStrategyRegistry.executeSubmit(eventData, mockRepository, {
        isEditAll: true,
      });

      expect(mockRepository.editEvent).toHaveBeenCalledWith(5, eventData);
    });
  });
});

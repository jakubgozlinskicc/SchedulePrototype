import { beforeEach, describe, expect, it, vi } from "vitest";
import { SubmitExistingEventStrategy } from "./SubmitExistingEventStrategy";
import type { Event } from "../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";
import { setNewParentEvent } from "../../useRecurringEdit/setNewParentEvent";

vi.mock("../../useRecurringEdit/setNewParentEvent", () => ({
  setNewParentEvent: vi.fn().mockResolvedValue(undefined),
}));

describe("SubmitExistingEventStrategy", () => {
  let strategy: SubmitExistingEventStrategy;
  let mockRepository: IEventRepository;

  beforeEach(() => {
    strategy = new SubmitExistingEventStrategy();
    mockRepository = {
      addEvent: vi.fn().mockResolvedValue(1),
      getEvents: vi.fn().mockResolvedValue([]),
      getEventById: vi.fn().mockResolvedValue(undefined),
      editEvent: vi.fn().mockResolvedValue(undefined),
      deleteEvent: vi.fn().mockResolvedValue(undefined),
      clearEvents: vi.fn().mockResolvedValue(undefined),
    };
    vi.clearAllMocks();
  });

  describe("canExecute", () => {
    it("should return true when event has id and isEditAll is false", () => {
      const eventData: Event = {
        id: 1,
        title: "Existing event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "none", interval: 1 },
      };

      expect(strategy.canExecute(eventData, { isEditAll: false })).toBe(true);
    });

    it("should return false when event has no id", () => {
      const eventData: Event = {
        title: "New event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "none", interval: 1 },
      };

      expect(strategy.canExecute(eventData, { isEditAll: false })).toBe(false);
    });

    it("should return false when isEditAll is true", () => {
      const eventData: Event = {
        id: 1,
        title: "Existing event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "daily", interval: 1 },
      };

      expect(strategy.canExecute(eventData, { isEditAll: true })).toBe(false);
    });

    it("should return false when isEditAll is undefined", () => {
      const eventData: Event = {
        id: 1,
        title: "Existing event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "none", interval: 1 },
      };

      expect(strategy.canExecute(eventData, {})).toBe(false);
    });
  });

  describe("execute", () => {
    it("should edit event directly when original event not found", async () => {
      const eventData: Event = {
        id: 1,
        title: "Existing event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "none", interval: 1 },
      };

      mockRepository.getEventById = vi.fn().mockResolvedValue(undefined);

      await strategy.execute(eventData, mockRepository);

      expect(mockRepository.editEvent).toHaveBeenCalledWith(1, eventData);
      expect(setNewParentEvent).not.toHaveBeenCalled();
    });

    it("should edit event directly when original event has no recurrence", async () => {
      const eventData: Event = {
        id: 1,
        title: "Existing event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "none", interval: 1 },
      };

      mockRepository.getEventById = vi.fn().mockResolvedValue({
        ...eventData,
        recurrenceRule: { type: "none", interval: 1 },
      });

      await strategy.execute(eventData, mockRepository);

      expect(mockRepository.editEvent).toHaveBeenCalledWith(1, eventData);
      expect(setNewParentEvent).not.toHaveBeenCalled();
    });

    it("should set new parent and clear recurrence when editing recurring event", async () => {
      const eventData: Event = {
        id: 1,
        title: "Updated recurring event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "daily", interval: 1 },
      };

      mockRepository.getEventById = vi.fn().mockResolvedValue({
        ...eventData,
        recurrenceRule: { type: "daily", interval: 1 },
      });

      await strategy.execute(eventData, mockRepository);

      expect(setNewParentEvent).toHaveBeenCalledWith(mockRepository, eventData);
      expect(mockRepository.editEvent).toHaveBeenCalledWith(1, {
        ...eventData,
        recurrenceRule: { type: "none", interval: 1 },
        cancelledDates: [],
      });
    });

    it("should call getEventById with correct id", async () => {
      const eventData: Event = {
        id: 5,
        title: "Test event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "none", interval: 1 },
      };

      await strategy.execute(eventData, mockRepository);

      expect(mockRepository.getEventById).toHaveBeenCalledWith(5);
    });
  });
});

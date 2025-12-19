import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Event } from "../../../../../../db/scheduleDb";
import { SubmitParentStrategy } from "./SubmitParentStrategy";
import type { IEventRepository } from "../../../IEventRepository";

vi.mock(
  "../../../useEventComponents/useRecurringEdit/setNewParentEvent",
  () => ({
    setNewParentEvent: vi.fn().mockResolvedValue(undefined),
  })
);

import { setNewParentEvent } from "../../../useEventComponents/useRecurringEdit/setNewParentEvent";

describe("SubmitParentStrategy", () => {
  let strategy = new SubmitParentStrategy();
  let mockRepository: IEventRepository;
  beforeEach(() => {
    strategy = new SubmitParentStrategy();
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
    it("should return true for recurring parent event with id", () => {
      const eventData: Event = {
        id: 1,
        title: "Recurring event",
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
      expect(strategy.canExecute(eventData)).toBe(true);
    });

    it("should return false for virtual occurrence with recurringEventId", () => {
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

    it("should return false for new event without id", () => {
      const eventData: Event = {
        title: "New event",
        description: "Test",
        start: new Date("2025-12-10T10:35"),
        end: new Date("2025-12-13T9"),
        color: "#FFD7D7",
        recurringEventId: undefined,
        recurrenceRule: {
          type: "none",
          interval: 1,
        },
      };
      expect(strategy.canExecute(eventData)).toBe(false);
    });

    it("should return false for regular event without recurrence", () => {
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
  });
  describe("execute", () => {
    it("should call setNewParentEvent and then editEvent", async () => {
      const eventData: Event = {
        id: 1,
        title: "Recurring event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#FFD7D7",
        recurringEventId: undefined,
        recurrenceRule: {
          type: "none",
          interval: 1,
        },
      };
      await strategy.execute(eventData, mockRepository);
      expect(setNewParentEvent).toHaveBeenCalledWith(mockRepository, eventData);
      expect(mockRepository.editEvent).toHaveBeenCalledWith(1, {
        ...eventData,
        recurrenceRule: { type: "none", interval: 1 },
        cancelledDates: [],
      });
    });

    it("should call repository.addEvent with correct parameters", async () => {
      const eventData: Event = {
        id: 1,
        title: "Recurring event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurringEventId: undefined,
        recurrenceRule: {
          type: "none",
          interval: 1,
        },
        cancelledDates: [],
      };
      await strategy.execute(eventData, mockRepository);
      expect(mockRepository.editEvent).toHaveBeenCalledWith(1, {
        ...eventData,
        recurrenceRule: { type: "none", interval: 1 },
        cancelledDates: [],
      });
    });
  });
});

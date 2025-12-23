import { beforeEach, describe, expect, it, vi } from "vitest";
import { DeleteRecurringParentStrategy } from "./DeleteRecurringParentStrategy";
import type { Event } from "../../../../../db/scheduleDb";

vi.mock(
  "../../../useEventComponents/useRecurringEdit/setNewParentEvent",
  () => ({
    setNewParentEvent: vi.fn().mockResolvedValue(undefined),
  })
);

import { setNewParentEvent } from "../../useRecurringEdit/setNewParentEvent";
import type { IEventRepository } from "../../../IEventRepository";

describe("DeleteRecurringParentStrategy", () => {
  let strategy: DeleteRecurringParentStrategy;
  let mockRepository: IEventRepository;

  beforeEach(() => {
    strategy = new DeleteRecurringParentStrategy();
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

    it("should return true for recurring parent event", () => {
      const eventData: Event = {
        id: 1,
        title: "Recurring event",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurringEventId: undefined,
        recurrenceRule: {
          type: "daily",
          interval: 4,
        },
      };

      expect(strategy.canExecute(eventData, { isDeleteAll: false })).toBe(true);
    });

    it("should return false for virtual occurrence", () => {
      const eventData: Event = {
        id: undefined,
        title: "Virtual occurrence",
        description: "Test",
        start: new Date("2025-12-10T10:00:00"),
        end: new Date("2025-12-10T11:00:00"),
        color: "#0000FF",
        recurringEventId: 1,
        recurrenceRule: {
          type: "daily",
          interval: 4,
        },
      };

      expect(strategy.canExecute(eventData, { isDeleteAll: false })).toBe(
        false
      );
    });
  });
  describe("execute", () => {
    describe("execute", () => {
      it("should call setNewParentEvent and then deleteEvent", async () => {
        const eventData: Event = {
          id: 10,
          title: "Recurring parent",
          description: "Test",
          start: new Date("2025-12-10T10:00:00"),
          end: new Date("2025-12-10T11:00:00"),
          color: "#0000FF",
          recurrenceRule: {
            type: "daily",
            interval: 0,
          },
        };

        await strategy.execute(eventData, mockRepository);

        expect(setNewParentEvent).toHaveBeenCalledWith(
          mockRepository,
          eventData
        );
        expect(mockRepository.deleteEvent).toHaveBeenCalledWith(10);
      });

      it("should delete the recurring parent event", async () => {
        const eventData: Event = {
          id: 1,
          title: "Recurring event",
          description: "Test",
          start: new Date("2025-12-10T10:00:00"),
          end: new Date("2025-12-10T11:00:00"),
          color: "#0000FF",
          recurringEventId: undefined,
          recurrenceRule: {
            type: "daily",
            interval: 4,
          },
        };

        await strategy.execute(eventData, mockRepository);

        expect(mockRepository.deleteEvent).toHaveBeenCalledWith(1);
      });
    });
  });
});

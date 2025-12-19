import { beforeEach, describe, expect, it, vi } from "vitest";
import { SubmitVirtualOccurrenceStrategy } from "./SubmitVirtualOccurenceStrategy";
import type { IEventRepository } from "../../../IEventRepository";
import type { Event } from "../../../../../../db/scheduleDb";

describe("SubmitVirtualOccurrenceStrategy", () => {
  let strategy = new SubmitVirtualOccurrenceStrategy();
  let mockRepository: IEventRepository;
  beforeEach(() => {
    strategy = new SubmitVirtualOccurrenceStrategy();
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
    it("should return true for virtual occurrence without id", () => {
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
      expect(strategy.canExecute(eventData)).toBe(true);
    });

    it("should return false for existing event with id", () => {
      const eventData: Event = {
        id: 1,
        title: "Existing event",
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

    it("should return false for new event without recurringEventId", () => {
      const eventData: Event = {
        title: "New event",
        description: "Test",
        start: new Date("2025-12-10T10:35"),
        end: new Date("2025-12-13T9"),
        color: "#FFD7D7",
        recurrenceRule: {
          type: "none",
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
    describe("execute", () => {
      it("should add cancelled date to parent and create new regular event", async () => {
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

        await strategy.execute(eventData, mockRepository);

        expect(mockRepository.getEventById).toHaveBeenCalledWith(5);
        expect(mockRepository.editEvent).toHaveBeenCalledWith(5, {
          cancelledDates: [new Date("2025-12-10T10:00:00").getTime()],
        });
        expect(mockRepository.addEvent).toHaveBeenCalledWith({
          ...eventData,
          recurrenceRule: { type: "none", interval: 1 },
          recurringEventId: undefined,
        });
      });

      it("should use originalStart for cancellation if available", async () => {
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

        const originalStartDate = new Date("2025-12-08T10:00:00");
        const eventData: Event = {
          title: "Modified occurrence",
          description: "Modified",
          start: new Date("2025-12-10T14:00:00"),
          end: new Date("2025-12-10T15:00:00"),
          color: "#FF0000",
          recurringEventId: 5,
          originalStart: originalStartDate,
        };

        mockRepository.getEventById = vi.fn().mockResolvedValue(parentEvent);

        await strategy.execute(eventData, mockRepository);

        expect(mockRepository.editEvent).toHaveBeenCalledWith(5, {
          cancelledDates: [originalStartDate.getTime()],
        });
      });

      it("should append to existing cancelledDates", async () => {
        const existingCancelledDate = new Date("2025-12-05T10:00:00").getTime();
        const parentEvent: Event = {
          id: 5,
          title: "Parent event",
          description: "Parent",
          start: new Date("2025-12-01T10:00:00"),
          end: new Date("2025-12-01T11:00:00"),
          color: "#0000FF",
          recurrenceRule: { type: "daily", interval: 1 },
          cancelledDates: [existingCancelledDate],
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

        await strategy.execute(eventData, mockRepository);

        expect(mockRepository.editEvent).toHaveBeenCalledWith(5, {
          cancelledDates: [
            existingCancelledDate,
            new Date("2025-12-10T10:00:00").getTime(),
          ],
        });
      });

      it("should handle parent without cancelledDates array", async () => {
        const parentEvent: Event = {
          id: 5,
          title: "Parent event",
          description: "Parent",
          start: new Date("2025-12-01T10:00:00"),
          end: new Date("2025-12-01T11:00:00"),
          color: "#0000FF",
          recurrenceRule: { type: "daily", interval: 1 },
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

        await strategy.execute(eventData, mockRepository);

        expect(mockRepository.editEvent).toHaveBeenCalledWith(5, {
          cancelledDates: [new Date("2025-12-10T10:00:00").getTime()],
        });
      });

      it("should throw error when parent event is not found", async () => {
        const eventData: Event = {
          title: "Virtual occurrence",
          description: "Test",
          start: new Date("2025-12-10T10:00:00"),
          end: new Date("2025-12-10T11:00:00"),
          color: "#0000FF",
          recurringEventId: 999,
        };

        mockRepository.getEventById = vi.fn().mockResolvedValue(null);

        await expect(
          strategy.execute(eventData, mockRepository)
        ).rejects.toThrow("Parent event not found");

        expect(mockRepository.editEvent).not.toHaveBeenCalled();
        expect(mockRepository.addEvent).not.toHaveBeenCalled();
      });

      it("should call editEvent before addEvent", async () => {
        const callOrder: string[] = [];

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
        mockRepository.editEvent = vi.fn().mockImplementation(async () => {
          callOrder.push("editEvent");
        });
        mockRepository.addEvent = vi.fn().mockImplementation(async () => {
          callOrder.push("addEvent");
          return 10;
        });

        await strategy.execute(eventData, mockRepository);

        expect(callOrder).toEqual(["editEvent", "addEvent"]);
      });

      it("should create new event with recurrenceRule type none", async () => {
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
          recurrenceRule: { type: "weekly", interval: 2 },
        };

        mockRepository.getEventById = vi.fn().mockResolvedValue(parentEvent);

        await strategy.execute(eventData, mockRepository);

        expect(mockRepository.addEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            recurrenceRule: { type: "none", interval: 1 },
            recurringEventId: undefined,
          })
        );
      });
    });
  });
});

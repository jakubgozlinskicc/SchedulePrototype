import { describe, it, expect, vi, beforeEach } from "vitest";
import { setNewParentEvent } from "./setNewParentEvent";
import type { Event } from "../../../../../db/scheduleDb";
import type { IEventRepository } from "../../IEventRepository";
import { findNextVirtualInstance } from "./findNextVirtualInstance";

vi.mock("./findNextVirtualInstance", () => ({
  findNextVirtualInstance: vi.fn().mockResolvedValue(null),
}));

describe("setNewParentEvent", () => {
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

  it("should edit event when original event is not found", async () => {
    const eventData: Event = {
      id: 1,
      title: "Test event",
      description: "Test",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
    };

    mockRepository.getEventById = vi.fn().mockResolvedValue(null);

    await setNewParentEvent(mockRepository, eventData);

    expect(mockRepository.editEvent).toHaveBeenCalledWith(1, eventData);
    expect(findNextVirtualInstance).not.toHaveBeenCalled();
  });

  it("should edit event when original event has no recurrence", async () => {
    const originalEvent: Event = {
      id: 1,
      title: "Non-recurring event",
      description: "Test",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
      recurrenceRule: {
        type: "none",
        interval: 0,
      },
    };

    const eventData: Event = {
      ...originalEvent,
      title: "Updated title",
    };

    mockRepository.getEventById = vi.fn().mockResolvedValue(originalEvent);

    await setNewParentEvent(mockRepository, eventData);

    expect(mockRepository.editEvent).toHaveBeenCalledWith(1, eventData);
    expect(findNextVirtualInstance).not.toHaveBeenCalled();
  });

  it("should call findNextVirtualInstance for recurring event", async () => {
    const originalEvent: Event = {
      id: 1,
      title: "Recurring event",
      description: "Test",
      start: new Date("2025-12-01T10:00:00"),
      end: new Date("2025-12-01T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1 },
    };

    const eventData: Event = {
      ...originalEvent,
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
    };

    mockRepository.getEventById = vi.fn().mockResolvedValue(originalEvent);

    await setNewParentEvent(mockRepository, eventData);

    expect(findNextVirtualInstance).toHaveBeenCalledWith(
      mockRepository,
      1,
      eventData.start
    );
  });

  it("should not add new event when no next instance found", async () => {
    const originalEvent: Event = {
      id: 1,
      title: "Recurring event",
      description: "Test",
      start: new Date("2025-12-01T10:00:00"),
      end: new Date("2025-12-01T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1 },
    };

    const eventData: Event = {
      ...originalEvent,
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
    };

    mockRepository.getEventById = vi.fn().mockResolvedValue(originalEvent);
    (findNextVirtualInstance as ReturnType<typeof vi.fn>).mockResolvedValue(
      null
    );

    await setNewParentEvent(mockRepository, eventData);

    expect(mockRepository.addEvent).not.toHaveBeenCalled();
  });

  it("should add new parent event with next instance dates", async () => {
    const originalEvent: Event = {
      id: 1,
      title: "Recurring event",
      description: "Test",
      start: new Date("2025-12-01T10:00:00"),
      end: new Date("2025-12-01T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1 },
    };

    const eventData: Event = {
      ...originalEvent,
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
    };

    const nextInstance = {
      index: 2,
      event: {
        ...originalEvent,
        start: new Date("2025-12-15T10:00:00"),
        end: new Date("2025-12-15T11:00:00"),
      },
    };

    mockRepository.getEventById = vi.fn().mockResolvedValue(originalEvent);
    (findNextVirtualInstance as ReturnType<typeof vi.fn>).mockResolvedValue(
      nextInstance
    );

    await setNewParentEvent(mockRepository, eventData);

    expect(mockRepository.addEvent).toHaveBeenCalledWith({
      title: "Recurring event",
      description: "Test",
      start: new Date("2025-12-15T10:00:00"),
      end: new Date("2025-12-15T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1 },
      recurringEventId: undefined,
    });
  });

  it("should not include id in new parent event", async () => {
    const originalEvent: Event = {
      id: 1,
      title: "Recurring event",
      description: "Test",
      start: new Date("2025-12-01T10:00:00"),
      end: new Date("2025-12-01T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1 },
    };

    const eventData: Event = {
      ...originalEvent,
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
    };

    const nextInstance = {
      index: 1,
      event: {
        ...originalEvent,
        start: new Date("2025-12-11T10:00:00"),
        end: new Date("2025-12-11T11:00:00"),
      },
    };

    mockRepository.getEventById = vi.fn().mockResolvedValue(originalEvent);
    (findNextVirtualInstance as ReturnType<typeof vi.fn>).mockResolvedValue(
      nextInstance
    );

    await setNewParentEvent(mockRepository, eventData);

    const addEventCall = (mockRepository.addEvent as ReturnType<typeof vi.fn>)
      .mock.calls[0][0];
    expect(addEventCall.id).toBeUndefined();
  });

  it("should decrement recurrence count by next instance index", async () => {
    const originalEvent: Event = {
      id: 1,
      title: "Recurring event",
      description: "Test",
      start: new Date("2025-12-01T10:00:00"),
      end: new Date("2025-12-01T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1, count: 10 },
    };

    const eventData: Event = {
      ...originalEvent,
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
    };

    const nextInstance = {
      index: 3,
      event: {
        ...originalEvent,
        start: new Date("2025-12-15T10:00:00"),
        end: new Date("2025-12-15T11:00:00"),
      },
    };

    mockRepository.getEventById = vi.fn().mockResolvedValue(originalEvent);
    (findNextVirtualInstance as ReturnType<typeof vi.fn>).mockResolvedValue(
      nextInstance
    );

    await setNewParentEvent(mockRepository, eventData);

    expect(mockRepository.addEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        recurrenceRule: { type: "daily", interval: 1, count: 7 },
      })
    );
  });

  it("should not modify count when count is undefined", async () => {
    const originalEvent: Event = {
      id: 1,
      title: "Recurring event",
      description: "Test",
      start: new Date("2025-12-01T10:00:00"),
      end: new Date("2025-12-01T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1 },
    };

    const eventData: Event = {
      ...originalEvent,
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
    };

    const nextInstance = {
      index: 3,
      event: {
        ...originalEvent,
        start: new Date("2025-12-15T10:00:00"),
        end: new Date("2025-12-15T11:00:00"),
      },
    };

    mockRepository.getEventById = vi.fn().mockResolvedValue(originalEvent);
    (findNextVirtualInstance as ReturnType<typeof vi.fn>).mockResolvedValue(
      nextInstance
    );

    await setNewParentEvent(mockRepository, eventData);

    expect(mockRepository.addEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        recurrenceRule: { type: "daily", interval: 1 },
      })
    );
  });

  it("should not modify count when count is 0", async () => {
    const originalEvent: Event = {
      id: 1,
      title: "Recurring event",
      description: "Test",
      start: new Date("2025-12-01T10:00:00"),
      end: new Date("2025-12-01T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1, count: 0 },
    };

    const eventData: Event = {
      ...originalEvent,
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
    };

    const nextInstance = {
      index: 3,
      event: {
        ...originalEvent,
        start: new Date("2025-12-15T10:00:00"),
        end: new Date("2025-12-15T11:00:00"),
      },
    };

    mockRepository.getEventById = vi.fn().mockResolvedValue(originalEvent);
    (findNextVirtualInstance as ReturnType<typeof vi.fn>).mockResolvedValue(
      nextInstance
    );

    await setNewParentEvent(mockRepository, eventData);

    const addEventCall = (mockRepository.addEvent as ReturnType<typeof vi.fn>)
      .mock.calls[0][0];
    expect(addEventCall.recurrenceRule.count).toBe(0);
  });

  it("should preserve all original event properties except id", async () => {
    const originalEvent: Event = {
      id: 1,
      title: "Recurring event",
      description: "Test description",
      start: new Date("2025-12-01T10:00:00"),
      end: new Date("2025-12-01T11:00:00"),
      color: "#FF0000",
      recurrenceRule: { type: "weekly", interval: 2 },
      cancelledDates: [new Date("2025-12-08T10:00:00").getTime()],
    };

    const eventData: Event = {
      ...originalEvent,
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
    };

    const nextInstance = {
      index: 1,
      event: {
        ...originalEvent,
        start: new Date("2025-12-15T10:00:00"),
        end: new Date("2025-12-15T11:00:00"),
      },
    };

    mockRepository.getEventById = vi.fn().mockResolvedValue(originalEvent);
    (findNextVirtualInstance as ReturnType<typeof vi.fn>).mockResolvedValue(
      nextInstance
    );

    await setNewParentEvent(mockRepository, eventData);

    expect(mockRepository.addEvent).toHaveBeenCalledWith({
      title: "Recurring event",
      description: "Test description",
      start: new Date("2025-12-15T10:00:00"),
      end: new Date("2025-12-15T11:00:00"),
      color: "#FF0000",
      recurrenceRule: { type: "weekly", interval: 2 },
      cancelledDates: [new Date("2025-12-08T10:00:00").getTime()],
      recurringEventId: undefined,
    });
  });

  it("should set recurringEventId to undefined in new parent", async () => {
    const originalEvent: Event = {
      id: 1,
      title: "Recurring event",
      description: "Test",
      start: new Date("2025-12-01T10:00:00"),
      end: new Date("2025-12-01T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1 },
      recurringEventId: 5,
    };

    const eventData: Event = {
      ...originalEvent,
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
    };

    const nextInstance = {
      index: 1,
      event: {
        ...originalEvent,
        start: new Date("2025-12-11T10:00:00"),
        end: new Date("2025-12-11T11:00:00"),
      },
    };

    mockRepository.getEventById = vi.fn().mockResolvedValue(originalEvent);
    (findNextVirtualInstance as ReturnType<typeof vi.fn>).mockResolvedValue(
      nextInstance
    );

    await setNewParentEvent(mockRepository, eventData);

    expect(mockRepository.addEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        recurringEventId: undefined,
      })
    );
  });
});

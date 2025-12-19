import { describe, it, expect } from "vitest";
import { DailyRecurrenceStrategy } from "./DailyRecurrenceStrategy";
import type { Event } from "../../../../db/scheduleDb";
import type { RecurrenceRule } from "../../recurrenceTypes";

const createBaseEvent = (): Event => ({
  id: 1,
  title: "Test",
  description: "",
  start: new Date("2025-01-01T10:00:00"),
  end: new Date("2025-01-01T11:00:00"),
  color: "#0000FF",
});

describe("BaseRecurrenceStrategy", () => {
  const strategy = new DailyRecurrenceStrategy();
  const rangeStart = new Date("2025-01-01");
  const rangeEnd = new Date("2025-01-10T23:59:59");

  it("should generate occurrences with correct dates", () => {
    const event = createBaseEvent();
    const rule: RecurrenceRule = { type: "daily", interval: 1 };

    const result = strategy.generateOccurrences(
      event,
      rule,
      rangeStart,
      rangeEnd
    );

    expect(result.length).toBe(10);
    expect(result[0].start.getDate()).toBe(1);
    expect(result[9].start.getDate()).toBe(10);
  });

  it("should preserve event duration", () => {
    const event = createBaseEvent();
    const rule: RecurrenceRule = { type: "daily", interval: 1 };

    const result = strategy.generateOccurrences(
      event,
      rule,
      rangeStart,
      rangeEnd
    );

    const duration = result[0].end.getTime() - result[0].start.getTime();
    expect(duration).toBe(60 * 60 * 1000);
  });

  it("should respect interval", () => {
    const event = createBaseEvent();
    const rule: RecurrenceRule = { type: "daily", interval: 2 };

    const result = strategy.generateOccurrences(
      event,
      rule,
      rangeStart,
      rangeEnd
    );

    expect(result[0].start.getDate()).toBe(1);
    expect(result[1].start.getDate()).toBe(3);
    expect(result[2].start.getDate()).toBe(5);
  });

  it("should respect count limit", () => {
    const event = createBaseEvent();
    const rule: RecurrenceRule = { type: "daily", interval: 1, count: 3 };

    const result = strategy.generateOccurrences(
      event,
      rule,
      rangeStart,
      rangeEnd
    );

    expect(result.length).toBe(3);
  });

  it("should respect endDate", () => {
    const event = createBaseEvent();
    const rule: RecurrenceRule = {
      type: "daily",
      interval: 1,
      endDate: new Date("2025-01-05T23:59:59"),
    };

    const result = strategy.generateOccurrences(
      event,
      rule,
      rangeStart,
      rangeEnd
    );

    expect(result.length).toBe(5);
  });

  it("should set recurringEventId for non-first occurrences", () => {
    const event = createBaseEvent();
    const rule: RecurrenceRule = { type: "daily", interval: 1 };

    const result = strategy.generateOccurrences(
      event,
      rule,
      rangeStart,
      rangeEnd
    );

    expect(result[0].id).toBe(1);
    expect(result[0].recurringEventId).toBeUndefined();
    expect(result[1].id).toBeUndefined();
    expect(result[1].recurringEventId).toBe(1);
  });

  it("should set originalStart for non-first occurrences", () => {
    const event = createBaseEvent();
    const rule: RecurrenceRule = { type: "daily", interval: 1 };

    const result = strategy.generateOccurrences(
      event,
      rule,
      rangeStart,
      rangeEnd
    );

    expect(result[0].originalStart).toBeUndefined();
    expect(result[1].originalStart).toEqual(result[1].start);
  });
});

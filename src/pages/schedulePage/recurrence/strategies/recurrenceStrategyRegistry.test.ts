import { describe, it, expect } from "vitest";
import { RecurrenceStrategyRegistry } from "./recurrenceStrategyRegistry";
import type { Event } from "../../../../db/scheduleDb";

const createBaseEvent = (
  type: "none" | "daily" | "weekly" | "monthly" | "yearly" = "daily"
): Event => ({
  id: 1,
  title: "Test",
  description: "",
  start: new Date("2025-01-01T10:00:00"),
  end: new Date("2025-01-01T11:00:00"),
  color: "#0000FF",
  recurrenceRule: { type, interval: 1 },
});

describe("RecurrenceStrategyRegistry", () => {
  const rangeStart = new Date("2025-01-01");
  const rangeEnd = new Date("2025-01-31");

  it("should return single event when no recurrence rule", () => {
    const event = { ...createBaseEvent(), recurrenceRule: undefined };

    const result = RecurrenceStrategyRegistry.generateOccurrences(
      event,
      rangeStart,
      rangeEnd
    );

    expect(result).toEqual([event]);
  });

  it("should return single event when type is none", () => {
    const event = createBaseEvent("none");

    const result = RecurrenceStrategyRegistry.generateOccurrences(
      event,
      rangeStart,
      rangeEnd
    );

    expect(result).toEqual([event]);
  });

  it("should use correct strategy for each type", () => {
    const types = ["daily", "weekly", "monthly", "yearly"] as const;

    types.forEach((type) => {
      const event = createBaseEvent(type);
      const result = RecurrenceStrategyRegistry.generateOccurrences(
        event,
        rangeStart,
        rangeEnd
      );
      expect(result.length).toBeGreaterThan(0);
    });
  });

  it("should throw error for unknown type", () => {
    const event = {
      ...createBaseEvent(),
      recurrenceRule: { type: "unknown" as "daily", interval: 1 },
    };

    expect(() =>
      RecurrenceStrategyRegistry.generateOccurrences(
        event,
        rangeStart,
        rangeEnd
      )
    ).toThrow("No strategy found for recurrence type: unknown");
  });
});

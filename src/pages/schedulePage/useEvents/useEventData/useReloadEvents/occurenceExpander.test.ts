import { describe, it, expect, vi } from "vitest";
import { expandRecurringEvent } from "./occurenceExpander";
import type { Event } from "../../../../../db/scheduleDb";
import type { DateRange } from "./reloadEventTypes";

vi.mock("../../../recurrence/strategies/recurrenceStrategyRegistry", () => ({
  RecurrenceStrategyRegistry: {
    generateOccurrences: vi.fn(() => []),
  },
}));

import { RecurrenceStrategyRegistry } from "../../../recurrence/strategies/recurrenceStrategyRegistry";

describe("expandRecurringEvent", () => {
  const range: DateRange = {
    start: new Date("2025-01-01"),
    end: new Date("2025-12-31"),
  };

  it("should call generateOccurrences with correct params", () => {
    const event: Event = {
      id: 1,
      title: "Recurring",
      description: "",
      start: new Date(),
      end: new Date(),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1 },
    };

    expandRecurringEvent(event, range);

    expect(RecurrenceStrategyRegistry.generateOccurrences).toHaveBeenCalledWith(
      event,
      range.start,
      range.end
    );
  });

  it("should filter out cancelled occurrences", () => {
    const cancelledTime = new Date("2025-06-15T10:00:00").getTime();
    const event: Event = {
      id: 1,
      title: "Recurring",
      description: "",
      start: new Date(),
      end: new Date(),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1 },
      cancelledDates: [cancelledTime],
    };

    const occurrences: Event[] = [
      { ...event, originalStart: new Date("2025-06-15T10:00:00") },
      { ...event, originalStart: new Date("2025-06-16T10:00:00") },
    ];

    (
      RecurrenceStrategyRegistry.generateOccurrences as ReturnType<typeof vi.fn>
    ).mockReturnValue(occurrences);

    const result = expandRecurringEvent(event, range);

    expect(result.length).toBe(1);
    expect(result[0].originalStart?.getTime()).toBe(
      new Date("2025-06-16T10:00:00").getTime()
    );
  });
});

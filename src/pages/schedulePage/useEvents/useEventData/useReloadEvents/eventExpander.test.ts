import { describe, it, expect, vi } from "vitest";
import { expandAllEvents } from "./eventExpander";
import type { Event } from "../../../../../db/scheduleDb";

vi.mock("./occurenceExpander", () => ({
  expandRecurringEvent: vi.fn((event) => [event, { ...event, id: undefined }]),
}));

describe("expandAllEvents", () => {
  it("should return non-recurring events as-is", () => {
    const events: Event[] = [
      {
        id: 1,
        title: "Regular event",
        description: "",
        start: new Date(),
        end: new Date(),
        color: "#0000FF",
        recurrenceRule: {
          type: "none",
          interval: 0,
        },
      },
    ];

    const result = expandAllEvents(events);

    expect(result).toEqual(events);
  });

  it("should expand recurring events", () => {
    const events: Event[] = [
      {
        id: 1,
        title: "Recurring event",
        description: "",
        start: new Date(),
        end: new Date(),
        color: "#0000FF",
        recurrenceRule: { type: "daily", interval: 1 },
      },
    ];

    const result = expandAllEvents(events);

    expect(result.length).toBe(2);
  });

  it("should not expand events without id", () => {
    const events: Event[] = [
      {
        title: "No id event",
        description: "",
        start: new Date(),
        end: new Date(),
        color: "#0000FF",
        recurrenceRule: { type: "daily", interval: 1 },
      },
    ];

    const result = expandAllEvents(events);

    expect(result).toEqual(events);
  });
});

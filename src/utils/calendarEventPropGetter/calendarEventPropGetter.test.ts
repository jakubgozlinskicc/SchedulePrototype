import { describe, it, expect } from "vitest";
import { calendarEventPropGetter } from "./calendarEventPropGetter";
import type { Event } from "../../db/scheduleDb";

describe("calendarEventPropGetter", () => {
  const createMockEvent = (overrides: Partial<Event> = {}): Event => ({
    id: 1,
    title: "test",
    description: "test",
    start: new Date(),
    end: new Date(),
    color: "#0000FF",
    ...overrides,
  });

  it("It should return className 'colored-event'", () => {
    const event = createMockEvent();
    const result = calendarEventPropGetter(event);
    expect(result.className).toBe("colored-event");
  });

  it("It should return object with correct keys", () => {
    const event = createMockEvent();
    const result = calendarEventPropGetter(event);

    expect(result).toHaveProperty("className");
    expect(result).toHaveProperty("style");
  });

  it("style contain only necessary properties", () => {
    const event = createMockEvent();
    const result = calendarEventPropGetter(event);

    const styleKeys = Object.keys(result.style);
    expect(styleKeys).toContain("--event-color");
    expect(styleKeys).toHaveLength(1);
  });

  it("It should set --event-color to event.color", () => {
    const event = createMockEvent({ color: "#9435c0ff" });
    const result = calendarEventPropGetter(event);
    expect(result.style["--event-color"]).toBe("#9435c0ff");
  });
});

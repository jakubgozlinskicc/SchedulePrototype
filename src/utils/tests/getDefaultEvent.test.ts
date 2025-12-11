import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getDefaultEvent } from "../getDefaultEvent";

describe("getDefaultEvent", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-15T10:30:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return object with default values", () => {
    const event = getDefaultEvent();

    expect(event).toEqual({
      id: undefined,
      title: "",
      description: "",
      start: new Date("2024-01-15T10:30:00.000Z"),
      end: new Date("2024-01-15T10:30:00.000Z"),
      color: "#0000FF",
    });
  });

  it("should return new object when called", () => {
    const event1 = getDefaultEvent();
    const event2 = getDefaultEvent();

    expect(event1).not.toBe(event2);
    expect(event1.start).not.toBe(event2.start);
    expect(event1.end).not.toBe(event2.end);
  });
});

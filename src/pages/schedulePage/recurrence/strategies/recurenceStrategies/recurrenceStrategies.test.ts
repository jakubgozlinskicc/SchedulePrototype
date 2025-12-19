import { describe, it, expect } from "vitest";
import { DailyRecurrenceStrategy } from "./DailyRecurrenceStrategy";
import { WeeklyRecurrenceStrategy } from "./WeeklyRecurrenceStrategy";
import { MonthlyRecurrenceStrategy } from "./MonthlyRecurrenceStrategy";
import { YearlyRecurrenceStrategy } from "./YearlyRecurrenceStrategy";
import type { Event } from "../../../../../db/scheduleDb";
import type { RecurrenceRule } from "../../recurrenceTypes";

const createBaseEvent = (): Event => ({
  id: 1,
  title: "Test",
  description: "",
  start: new Date("2025-01-01T10:00:00"),
  end: new Date("2025-01-01T11:00:00"),
  color: "#0000FF",
});

describe("DailyRecurrenceStrategy", () => {
  const strategy = new DailyRecurrenceStrategy();

  it("should support daily type", () => {
    expect(strategy.canSupport("daily")).toBe(true);
    expect(strategy.canSupport("weekly")).toBe(false);
  });

  it("should advance by days", () => {
    const event = createBaseEvent();
    const rule: RecurrenceRule = { type: "daily", interval: 3 };

    const result = strategy.generateOccurrences(
      event,
      rule,
      new Date("2025-01-01"),
      new Date("2025-01-10")
    );

    expect(result[1].start.getDate()).toBe(4);
    expect(result[2].start.getDate()).toBe(7);
  });
});

describe("WeeklyRecurrenceStrategy", () => {
  const strategy = new WeeklyRecurrenceStrategy();

  it("should support weekly type", () => {
    expect(strategy.canSupport("weekly")).toBe(true);
    expect(strategy.canSupport("daily")).toBe(false);
  });

  it("should advance by weeks", () => {
    const event = createBaseEvent();
    const rule: RecurrenceRule = { type: "weekly", interval: 1 };

    const result = strategy.generateOccurrences(
      event,
      rule,
      new Date("2025-01-01"),
      new Date("2025-01-31")
    );

    expect(result[0].start.getDate()).toBe(1);
    expect(result[1].start.getDate()).toBe(8);
    expect(result[2].start.getDate()).toBe(15);
  });
});

describe("MonthlyRecurrenceStrategy", () => {
  const strategy = new MonthlyRecurrenceStrategy();

  it("should support monthly type", () => {
    expect(strategy.canSupport("monthly")).toBe(true);
    expect(strategy.canSupport("weekly")).toBe(false);
  });

  it("should advance by months", () => {
    const event = createBaseEvent();
    const rule: RecurrenceRule = { type: "monthly", interval: 1 };

    const result = strategy.generateOccurrences(
      event,
      rule,
      new Date("2025-01-01"),
      new Date("2025-06-30")
    );

    expect(result[0].start.getMonth()).toBe(0);
    expect(result[1].start.getMonth()).toBe(1);
    expect(result[2].start.getMonth()).toBe(2);
  });
});

describe("YearlyRecurrenceStrategy", () => {
  const strategy = new YearlyRecurrenceStrategy();

  it("should support yearly type", () => {
    expect(strategy.canSupport("yearly")).toBe(true);
    expect(strategy.canSupport("monthly")).toBe(false);
  });

  it("should advance by years", () => {
    const event = createBaseEvent();
    const rule: RecurrenceRule = { type: "yearly", interval: 1 };

    const result = strategy.generateOccurrences(
      event,
      rule,
      new Date("2025-01-01"),
      new Date("2030-12-31")
    );

    expect(result[0].start.getFullYear()).toBe(2025);
    expect(result[1].start.getFullYear()).toBe(2026);
    expect(result[2].start.getFullYear()).toBe(2027);
  });
});

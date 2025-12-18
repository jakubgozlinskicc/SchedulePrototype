import { describe, it, expect } from "vitest";
import { MonthViewDatePickerStrategy } from "./monthViewStrategy";
import { WeekViewDatePickerStrategy } from "./weekViewStrategy";
import { DayViewDatePickerStrategy } from "./dayViewStrategy";

describe("MonthViewDatePickerStrategy", () => {
  const strategy = new MonthViewDatePickerStrategy();

  it("should support month view only", () => {
    expect(strategy.canSupport("month")).toBe(true);
    expect(strategy.canSupport("week")).toBe(false);
    expect(strategy.canSupport("day")).toBe(false);
  });

  it("should return component", () => {
    expect(strategy.getComponent()).toBeDefined();
  });
});

describe("WeekViewDatePickerStrategy", () => {
  const strategy = new WeekViewDatePickerStrategy();

  it("should support week view only", () => {
    expect(strategy.canSupport("week")).toBe(true);
    expect(strategy.canSupport("month")).toBe(false);
    expect(strategy.canSupport("day")).toBe(false);
  });

  it("should return component", () => {
    expect(strategy.getComponent()).toBeDefined();
  });
});

describe("DayViewDatePickerStrategy", () => {
  const strategy = new DayViewDatePickerStrategy();

  it("should support day view only", () => {
    expect(strategy.canSupport("day")).toBe(true);
    expect(strategy.canSupport("month")).toBe(false);
    expect(strategy.canSupport("week")).toBe(false);
  });

  it("should return component", () => {
    expect(strategy.getComponent()).toBeDefined();
  });
});

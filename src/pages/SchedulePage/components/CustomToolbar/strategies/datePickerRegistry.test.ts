import { describe, it, expect } from "vitest";
import { DatePickerStrategyRegistry } from "./datePickerRegistry";

describe("DatePickerStrategyRegistry", () => {
  it("should return strategy for month view", () => {
    const strategy = DatePickerStrategyRegistry.provideConfig("month");

    expect(strategy.canSupport("month")).toBe(true);
    expect(strategy.getComponent()).toBeDefined();
  });

  it("should return strategy for week view", () => {
    const strategy = DatePickerStrategyRegistry.provideConfig("week");

    expect(strategy.canSupport("week")).toBe(true);
    expect(strategy.getComponent()).toBeDefined();
  });

  it("should return strategy for day view", () => {
    const strategy = DatePickerStrategyRegistry.provideConfig("day");

    expect(strategy.canSupport("day")).toBe(true);
    expect(strategy.getComponent()).toBeDefined();
  });

  it("should throw error for unknown view", () => {
    expect(() => DatePickerStrategyRegistry.provideConfig("unknown")).toThrow(
      "No DatePickerStrategy found for view: unknown"
    );
  });
});

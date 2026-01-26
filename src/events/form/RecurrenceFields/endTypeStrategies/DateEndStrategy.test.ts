import { describe, it, expect, beforeEach } from "vitest";
import { DateEndStrategy } from "./DateEndStrategy";
import { DateEndField } from "../components/DateEndField";

describe("DateEndStrategy", () => {
  let strategy: DateEndStrategy;

  beforeEach(() => {
    strategy = new DateEndStrategy();
  });

  describe("type", () => {
    it("should have type date", () => {
      expect(strategy.type).toBe("date");
    });
  });

  describe("canDeriveFrom", () => {
    it("should return true when endDate exists", () => {
      expect(strategy.canDeriveFrom({ endDate: "2025-12-31" })).toBe(true);
    });

    it("should return false when endDate is undefined", () => {
      expect(strategy.canDeriveFrom({})).toBe(false);
    });

    it("should return false when endDate is empty string", () => {
      expect(strategy.canDeriveFrom({ endDate: "" })).toBe(false);
    });

    it("should return false when rule is undefined", () => {
      expect(strategy.canDeriveFrom(undefined)).toBe(false);
    });
  });

  describe("getComponent", () => {
    it("should return DateEndField component", () => {
      expect(strategy.getComponent()).toBe(DateEndField);
    });
  });
});

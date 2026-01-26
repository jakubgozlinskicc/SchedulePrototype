import { describe, it, expect, beforeEach } from "vitest";
import { CountEndStrategy } from "./CountEndStrategy";
import { CountEndField } from "../components/CountEndField";

describe("CountEndStrategy", () => {
  let strategy: CountEndStrategy;

  beforeEach(() => {
    strategy = new CountEndStrategy();
  });

  describe("type", () => {
    it("should have type count", () => {
      expect(strategy.type).toBe("count");
    });
  });

  describe("canDeriveFrom", () => {
    it("should return true when count exists", () => {
      expect(strategy.canDeriveFrom({ count: 10 })).toBe(true);
    });

    it("should return false when count is undefined", () => {
      expect(strategy.canDeriveFrom({})).toBe(false);
    });

    it("should return false when count is 0", () => {
      expect(strategy.canDeriveFrom({ count: 0 })).toBe(false);
    });

    it("should return false when rule is undefined", () => {
      expect(strategy.canDeriveFrom(undefined)).toBe(false);
    });
  });

  describe("getComponent", () => {
    it("should return CountEndField component", () => {
      expect(strategy.getComponent()).toBe(CountEndField);
    });
  });
});

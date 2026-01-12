import { describe, it, expect } from "vitest";
import { EndTypeStrategyRegistry } from "../endTypeStrategies/endTypeStrategyRegistry";
import { DateEndStrategy } from "../endTypeStrategies/DateEndStrategy";
import { CountEndStrategy } from "../endTypeStrategies/CountEndStrategy";
import { NeverEndStrategy } from "../endTypeStrategies/NeverEndStrategy";

describe("EndTypeStrategyRegistry", () => {
  describe("provideConfig", () => {
    it("should return DateEndStrategy for date end type", () => {
      const strategy = EndTypeStrategyRegistry.provideConfig("date");

      expect(strategy).toBeInstanceOf(DateEndStrategy);
      expect(strategy.type).toBe("date");
    });

    it("should return CountEndStrategy for count end type", () => {
      const strategy = EndTypeStrategyRegistry.provideConfig("count");

      expect(strategy).toBeInstanceOf(CountEndStrategy);
      expect(strategy.type).toBe("count");
    });

    it("should return NeverEndStrategy for never end type", () => {
      const strategy = EndTypeStrategyRegistry.provideConfig("never");

      expect(strategy).toBeInstanceOf(NeverEndStrategy);
      expect(strategy.type).toBe("never");
    });

    it("should throw error for unknown end type", () => {
      expect(() => {
        EndTypeStrategyRegistry.provideConfig("unknown" as any);
      }).toThrow("No EndTypeStrategy found for endType: unknown");
    });
  });
});

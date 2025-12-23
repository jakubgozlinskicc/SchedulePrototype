import { describe, it, expect } from "vitest";
import { getDefaultDateRange } from "./dateRange";

describe("getDefaultDateRange", () => {
  it("should return range from last year to 5 years ahead", () => {
    const now = new Date();
    const result = getDefaultDateRange();

    expect(result.start.getFullYear()).toBe(now.getFullYear() - 1);
    expect(result.start.getMonth()).toBe(0);
    expect(result.end.getFullYear()).toBe(now.getFullYear() + 5);
    expect(result.end.getMonth()).toBe(11);
  });
});

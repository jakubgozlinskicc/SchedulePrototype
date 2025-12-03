import { describe, it, expect } from "vitest";
import { add, isEven } from "../src/math";

describe("math utils", () => {
  it("dodaje dwie liczby", () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
  });
});

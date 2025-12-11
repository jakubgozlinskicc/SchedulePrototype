import { describe, it, expect } from "vitest";
import { toDateTimeLocal } from "./toDateTimeLocal";

describe("toDateTimeLocal", () => {
  it("It should convert date to datetime-local format", () => {
    const date = new Date(2025, 11, 15, 10, 30, 0);
    const result = toDateTimeLocal(date);

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });

  it("It should return empty string for null", () => {
    expect(toDateTimeLocal(null as unknown as Date)).toBe("");
  });

  it("It should return empty string for undefined", () => {
    expect(toDateTimeLocal(undefined as unknown as Date)).toBe("");
  });

  it("It should preserve correct date and time in local timezone", () => {
    const date = new Date(2025, 11, 20, 14, 45, 0);
    const result = toDateTimeLocal(date);

    expect(result).toBe("2025-12-20T14:45");
  });

  it("It should handle midnight", () => {
    const date = new Date(2025, 11, 1, 0, 0, 0);
    const result = toDateTimeLocal(date);

    expect(result).toBe("2025-12-01T00:00");
  });

  it("It should handle end of day", () => {
    const date = new Date(2025, 11, 31, 23, 59, 0);
    const result = toDateTimeLocal(date);

    expect(result).toBe("2025-12-31T23:59");
  });

  it("It should return string with 16 characters", () => {
    const date = new Date(2025, 11, 15, 8, 30, 0);
    const result = toDateTimeLocal(date);

    expect(result).toHaveLength(16);
  });
});

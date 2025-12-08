import { describe, it, expect } from "vitest";
import { toDateTimeLocal } from "../utils/toDateTimeLocal";

describe("toDateTimeLocal", () => {
  it("konwertuje Date → datetime-local", () => {
    const d = new Date("2024-01-01T12:00:00Z");
    const result = toDateTimeLocal(d);

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });
});

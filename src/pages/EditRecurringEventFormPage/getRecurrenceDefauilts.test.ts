import { describe, it, expect } from "vitest";
import { getRecurrenceDefaults } from "./getRecurrenceDefaults";
import type { Event } from "../../db/scheduleDb";

describe("getRecurrenceDefaults", () => {
  it("should return none defaults when event is null", () => {
    const result = getRecurrenceDefaults(null);

    expect(result).toEqual({
      recurrenceType: "none",
      recurrenceInterval: 1,
      recurrenceEndType: "never",
      recurrenceEndDate: null,
      recurrenceCount: null,
    });
  });

  it("should return none defaults when recurrence rule is none", () => {
    const event: Event = {
      id: 1,
      title: "Test",
      description: "",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "none", interval: 0 },
    };

    const result = getRecurrenceDefaults(event);

    expect(result).toEqual({
      recurrenceType: "none",
      recurrenceInterval: 1,
      recurrenceEndType: "never",
      recurrenceEndDate: null,
      recurrenceCount: null,
    });
  });

  it("should return none defaults when recurrence rule is undefined", () => {
    const event: Event = {
      id: 1,
      title: "Test",
      description: "",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
    };

    const result = getRecurrenceDefaults(event);

    expect(result).toEqual({
      recurrenceType: "none",
      recurrenceInterval: 1,
      recurrenceEndType: "never",
      recurrenceEndDate: null,
      recurrenceCount: null,
    });
  });

  it("should return daily recurrence with never end", () => {
    const event: Event = {
      id: 1,
      title: "Test",
      description: "",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1 },
    };

    const result = getRecurrenceDefaults(event);

    expect(result.recurrenceType).toBe("daily");
    expect(result.recurrenceInterval).toBe(1);
    expect(result.recurrenceEndType).toBe("never");
    expect(result.recurrenceEndDate).toBeNull();
    expect(result.recurrenceCount).toBeNull();
  });

  it("should return recurrence with custom interval", () => {
    const event: Event = {
      id: 1,
      title: "Test",
      description: "",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 3 },
    };

    const result = getRecurrenceDefaults(event);

    expect(result.recurrenceType).toBe("daily");
    expect(result.recurrenceInterval).toBe(3);
    expect(result.recurrenceEndType).toBe("never");
  });

  it("should return recurrence with end date", () => {
    const endDate = new Date("2025-12-31T10:00:00");
    const event: Event = {
      id: 1,
      title: "Test",
      description: "",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "daily", interval: 1, endDate },
    };

    const result = getRecurrenceDefaults(event);

    expect(result.recurrenceType).toBe("daily");
    expect(result.recurrenceInterval).toBe(1);
    expect(result.recurrenceEndType).toBe("date");
    expect(result.recurrenceEndDate).toBeDefined();
    expect(result.recurrenceCount).toBeNull();
  });

  it("should return recurrence with count", () => {
    const event: Event = {
      id: 1,
      title: "Test",
      description: "",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "weekly", interval: 1, count: 10 },
    };

    const result = getRecurrenceDefaults(event);

    expect(result.recurrenceType).toBe("weekly");
    expect(result.recurrenceInterval).toBe(1);
    expect(result.recurrenceEndType).toBe("count");
    expect(result.recurrenceEndDate).toBeNull();
    expect(result.recurrenceCount).toBe(10);
  });

  it("should default interval to 1 when undefined", () => {
    const event: Event = {
      id: 1,
      title: "Test",
      description: "",
      start: new Date("2025-12-10T10:00:00"),
      end: new Date("2025-12-10T11:00:00"),
      color: "#0000FF",
      recurrenceRule: { type: "weekly" } as any,
    };

    const result = getRecurrenceDefaults(event);

    expect(result.recurrenceInterval).toBe(1);
  });
});

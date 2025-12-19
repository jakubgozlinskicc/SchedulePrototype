import { describe, it, expect, vi } from "vitest";
import { fieldHandlers, defaultFieldHandler } from "./fieldHandlers";
import type { Event } from "../../../../../db/scheduleDb";

const createBaseEvent = (): Event => ({
  title: "",
  description: "",
  start: new Date("2024-03-15T10:00:00"),
  end: new Date("2024-03-15T11:00:00"),
  color: "#0000FF",
  recurrenceRule: { type: "daily", interval: 2 },
});

describe("fieldHandlers", () => {
  describe("start", () => {
    it("should update start and adjust end if needed", () => {
      const prev = createBaseEvent();

      const updated = fieldHandlers.start(
        prev,
        "start",
        "2024-03-15T12:00",
        vi.fn()
      );

      expect(updated.start.getTime()).toBe(
        new Date("2024-03-15T12:00").getTime()
      );
      expect(updated.end.getTime()).toBe(
        new Date("2024-03-15T12:00").getTime()
      );
    });
  });

  describe("end", () => {
    it("should trigger shake when end is before start", () => {
      const prev = createBaseEvent();
      const triggerShake = vi.fn();

      const updated = fieldHandlers.end(
        prev,
        "end",
        "2024-03-15T09:00",
        triggerShake
      );

      expect(updated.end.getTime()).toBe(prev.start.getTime());
      expect(triggerShake).toHaveBeenCalled();
    });
  });

  describe("recurrenceType", () => {
    it("should update type and preserve interval", () => {
      const prev = createBaseEvent();

      const updated = fieldHandlers.recurrenceType(
        prev,
        "recurrenceType",
        "weekly",
        vi.fn()
      );

      expect(updated.recurrenceRule?.type).toBe("weekly");
      expect(updated.recurrenceRule?.interval).toBe(2);
    });
  });

  describe("recurrenceInterval", () => {
    it("should clamp interval between 1 and 100", () => {
      const prev = createBaseEvent();

      expect(
        fieldHandlers.recurrenceInterval(prev, "", "0", vi.fn()).recurrenceRule
          ?.interval
      ).toBe(1);
      expect(
        fieldHandlers.recurrenceInterval(prev, "", "150", vi.fn())
          .recurrenceRule?.interval
      ).toBe(100);
    });
  });

  describe("recurrenceEndType", () => {
    it("should set count for count type and endDate for date type", () => {
      const prev = createBaseEvent();

      const countUpdate = fieldHandlers.recurrenceEndType(
        prev,
        "",
        "count",
        vi.fn()
      );
      expect(countUpdate.recurrenceRule?.count).toBe(10);

      const dateUpdate = fieldHandlers.recurrenceEndType(
        prev,
        "",
        "date",
        vi.fn()
      );
      expect(dateUpdate.recurrenceRule?.endDate).toBeDefined();
    });
  });

  describe("recurrenceCount", () => {
    it("should clamp count between 1 and 365", () => {
      const prev = createBaseEvent();

      expect(
        fieldHandlers.recurrenceCount(prev, "", "0", vi.fn()).recurrenceRule
          ?.count
      ).toBe(1);
      expect(
        fieldHandlers.recurrenceCount(prev, "", "500", vi.fn()).recurrenceRule
          ?.count
      ).toBe(365);
    });
  });
});

describe("defaultFieldHandler", () => {
  it("should update field by name", () => {
    const prev = createBaseEvent();

    const updated = defaultFieldHandler(prev, "title", "New Title", vi.fn());

    expect(updated.title).toBe("New Title");
  });
});

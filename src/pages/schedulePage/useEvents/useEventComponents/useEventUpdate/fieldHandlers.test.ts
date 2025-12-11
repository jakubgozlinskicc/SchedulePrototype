import { describe, it, expect, vi } from "vitest";
import { fieldHandlers, defaultFieldHandler } from "./fieldHandlers";
import type { Event } from "../../../../../db/scheduleDb";

const createBaseEvent = (): Event => ({
  title: "",
  description: "",
  start: new Date("2024-03-15T10:00:00"),
  end: new Date("2024-03-15T11:00:00"),
  color: "#0000FF",
});

describe("fieldHandlers", () => {
  it("It should handle start field and update start date", () => {
    const prev = createBaseEvent();
    const handler = fieldHandlers.start;

    const updated = handler(prev, "start", "2024-03-16T10:00", vi.fn());

    expect(updated.start.getTime()).toBe(
      new Date("2024-03-16T10:00").getTime()
    );
  });

  it("It should update end when start becomes after current end", () => {
    const prev: Event = {
      ...createBaseEvent(),
      end: new Date("2024-03-15T11:00:00"),
    };

    const handler = fieldHandlers.start;

    const updated = handler(prev, "start", "2024-03-15T12:00", vi.fn());

    expect(updated.start.getTime()).toBe(
      new Date("2024-03-15T12:00").getTime()
    );
    expect(updated.end.getTime()).toBe(new Date("2024-03-15T12:00").getTime());
  });

  it("It should handle end field and trigger shake when end is before start", () => {
    const prev = createBaseEvent();
    const triggerShake = vi.fn();
    const handler = fieldHandlers.end;

    const updated = handler(prev, "end", "2024-03-15T09:00", triggerShake);

    expect(updated.end.getTime()).toBe(prev.start.getTime());
    expect(triggerShake).toHaveBeenCalledTimes(1);
  });

  it("It should handle end field without triggering shake when end is after start", () => {
    const prev = createBaseEvent();
    const triggerShake = vi.fn();
    const handler = fieldHandlers.end;

    const updated = handler(prev, "end", "2024-03-15T12:00", triggerShake);

    expect(updated.end.getTime()).toBe(new Date("2024-03-15T12:00").getTime());
    expect(triggerShake).not.toHaveBeenCalled();
  });
});

describe("defaultFieldHandler", () => {
  it("It should update arbitrary field", () => {
    const prev = createBaseEvent();

    const updated = defaultFieldHandler(prev, "title", "My title", vi.fn());

    expect(updated.title).toBe("My title");
  });

  it("It should not modify other fields", () => {
    const prev = createBaseEvent();

    const updated = defaultFieldHandler(
      prev,
      "description",
      "New description",
      vi.fn()
    );

    expect(updated.start).toBe(prev.start);
    expect(updated.end).toBe(prev.end);
    expect(updated.color).toBe(prev.color);
  });
});

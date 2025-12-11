import { describe, it, expect, vi } from "vitest";
import { calendarEventPropGetter } from "../calendarEventPropGetter";
import type { Event } from "../../db/scheduleDb";

vi.mock("./colorUtils", () => ({
  getTextColor: vi.fn((color: string) => {
    const brightness = parseInt(color.replace("#", ""), 16);
    return brightness > 0xffffff / 2 ? "black" : "white";
  }),
}));

describe("calendarEventPropGetter", () => {
  const createMockEvent = (overrides: Partial<Event> = {}): Event => ({
    id: 1,
    title: "test",
    description: "test",
    start: new Date(),
    end: new Date(),
    color: "#0000FF",
    ...overrides,
  });

  describe("return", () => {
    it("should return className 'colored-event'", () => {
      const event = createMockEvent();
      const result = calendarEventPropGetter(event);
      expect(result.className).toBe("colored-event");
    });
    it("should return object with correct keys", () => {
      const event = createMockEvent();
      const result = calendarEventPropGetter(event);

      expect(result).toHaveProperty("className");
      expect(result).toHaveProperty("style");
    });

    it("style contain only necessary properties", () => {
      const event = createMockEvent();
      const result = calendarEventPropGetter(event);

      const styleKeys = Object.keys(result.style);
      expect(styleKeys).toContain("--event-color");
      expect(styleKeys).toContain("color");
      expect(styleKeys).toHaveLength(2);
    });
  });

  describe("style", () => {
    it("should set --event-color to event.color", () => {
      const event = createMockEvent({ color: "#9435c0ff" });
      const result = calendarEventPropGetter(event);
      expect(result.style["--event-color"]).toBe("#9435c0ff");
    });

    it("should set white for dark background", () => {
      const event = createMockEvent({ color: "#000000" });
      const result = calendarEventPropGetter(event);
      expect(result.style.color).toBe("white");
    });

    it("should set black for bright background", () => {
      const event = createMockEvent({ color: "#FFFFFF" });
      const result = calendarEventPropGetter(event);
      expect(result.style.color).toBe("black");
    });
  });

  describe("different colors", () => {
    it("should handle blue", () => {
      const event = createMockEvent({ color: "#0000FF" });
      const result = calendarEventPropGetter(event);
      expect(result.style["--event-color"]).toBe("#0000FF");
      expect(result.style.color).toBe("white");
    });

    it("should handle red", () => {
      const event = createMockEvent({ color: "#FF0000" });
      const result = calendarEventPropGetter(event);
      expect(result.style["--event-color"]).toBe("#FF0000");
      expect(result.style.color).toBe("black");
    });

    it("should handle green", () => {
      const event = createMockEvent({ color: "#00FF00" });
      const result = calendarEventPropGetter(event);
      expect(result.style["--event-color"]).toBe("#00FF00");
      expect(result.style.color).toBe("white");
    });
  });
});

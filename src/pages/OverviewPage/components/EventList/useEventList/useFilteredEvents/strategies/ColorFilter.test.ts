import { describe, it, expect } from "vitest";
import { ColorFilter } from "./ColorFilter";
import type { Event } from "../../../../../../../db/scheduleDb";
import type { EventFilters } from "../../../../../context/filtersContext";

describe("ColorFilter", () => {
  const colorFilter = new ColorFilter();

  const createEvent = (color: string): Event => ({
    id: 1,
    title: "Test Event",
    description: "Test Description",
    start: new Date("2024-06-15T10:00:00"),
    end: new Date("2024-06-15T11:00:00"),
    color,
  });

  const createFilters = (colors: string[]): EventFilters => ({
    searchQuery: "",
    showPastEvents: false,
    dateFrom: null,
    dateTo: null,
    colors,
  });

  describe("isActive", () => {
    it("should return true when colors are selected", () => {
      expect(colorFilter.isActive(createFilters(["red"]))).toBe(true);
    });

    it("should return false when no colors are selected", () => {
      expect(colorFilter.isActive(createFilters([]))).toBe(false);
    });

    it("should return true when multiple colors are selected", () => {
      expect(
        colorFilter.isActive(createFilters(["red", "blue", "green"]))
      ).toBe(true);
    });
  });

  describe("apply", () => {
    it("should return true when no colors filter is applied", () => {
      const event = createEvent("#FF0000");
      expect(colorFilter.apply(event, createFilters([]))).toBe(true);
    });

    it("should return false when event color does not match filter", () => {
      const event = createEvent("#AABBCC");
      expect(colorFilter.apply(event, createFilters(["red"]))).toBe(false);
    });

    it("should match exact red color", () => {
      const event = createEvent("#FF0000");
      expect(colorFilter.apply(event, createFilters(["red"]))).toBe(true);
    });

    it("should match close red color variation", () => {
      const event = createEvent("#EE1111");
      expect(colorFilter.apply(event, createFilters(["red"]))).toBe(true);
    });

    it("should not match blue when filtering for red", () => {
      const event = createEvent("#0000FF");
      expect(colorFilter.apply(event, createFilters(["red"]))).toBe(false);
    });

    it("should match any of multiple selected colors", () => {
      const event = createEvent("#0000FF");
      expect(colorFilter.apply(event, createFilters(["red", "blue"]))).toBe(
        true
      );
    });

    it("should handle invalid hex color", () => {
      const event = createEvent("invalid");
      expect(colorFilter.apply(event, createFilters(["red"]))).toBe(false);
    });

    it("should match green color", () => {
      const event = createEvent("#00FF00");
      expect(colorFilter.apply(event, createFilters(["green"]))).toBe(true);
    });

    it("should match purple color", () => {
      const event = createEvent("#800080");
      expect(colorFilter.apply(event, createFilters(["purple"]))).toBe(true);
    });

    it("should handle hex without hash", () => {
      const event = createEvent("FF0000");
      expect(colorFilter.apply(event, createFilters(["red"]))).toBe(true);
    });

    it("should match orange color", () => {
      const event = createEvent("#FF8C00");
      expect(colorFilter.apply(event, createFilters(["orange"]))).toBe(true);
    });

    it("should match yellow color", () => {
      const event = createEvent("#FFFF00");
      expect(colorFilter.apply(event, createFilters(["yellow"]))).toBe(true);
    });

    it("should match pink color", () => {
      const event = createEvent("#FF69B4");
      expect(colorFilter.apply(event, createFilters(["pink"]))).toBe(true);
    });

    it("should match black color", () => {
      const event = createEvent("#000000");
      expect(colorFilter.apply(event, createFilters(["black"]))).toBe(true);
    });

    it("should match white color", () => {
      const event = createEvent("#FFFFFF");
      expect(colorFilter.apply(event, createFilters(["white"]))).toBe(true);
    });

    it("should match gray color", () => {
      const event = createEvent("#808080");
      expect(colorFilter.apply(event, createFilters(["gray"]))).toBe(true);
    });

    it("should handle lowercase hex", () => {
      const event = createEvent("#ff0000");
      expect(colorFilter.apply(event, createFilters(["red"]))).toBe(true);
    });

    it("should match brown color", () => {
      const event = createEvent("#8B4513");
      expect(colorFilter.apply(event, createFilters(["brown"]))).toBe(true);
    });

    it("should match cyan color", () => {
      const event = createEvent("#00CCCC");
      expect(colorFilter.apply(event, createFilters(["cyan"]))).toBe(true);
    });

    it("should match gold color", () => {
      const event = createEvent("#FFD700");
      expect(colorFilter.apply(event, createFilters(["gold"]))).toBe(true);
    });

    it("should return false for empty color string", () => {
      const event = createEvent("");
      expect(colorFilter.apply(event, createFilters(["red"]))).toBe(false);
    });
  });
});

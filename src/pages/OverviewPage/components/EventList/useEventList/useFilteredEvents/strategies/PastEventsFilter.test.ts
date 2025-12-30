import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { PastEventsFilter } from "./PastEventsFilter";
import type { Event } from "../../../../../../../db/scheduleDb";
import type { EventFilters } from "../../../../../context/filtersContext";

describe("PastEventsFilter", () => {
  const pastEventsFilter = new PastEventsFilter();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:00:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createEvent = (start: Date): Event => ({
    id: 1,
    title: "Test Event",
    description: "Test Description",
    start,
    end: new Date(start.getTime() + 3600000),
    color: "#0000FF",
  });

  const createFilters = (showPastEvents: boolean): EventFilters => ({
    searchQuery: "",
    showPastEvents,
    dateFrom: null,
    dateTo: null,
    colors: [],
  });

  describe("isActive", () => {
    it("should return true when showPastEvents is false", () => {
      expect(pastEventsFilter.isActive(createFilters(false))).toBe(true);
    });

    it("should return false when showPastEvents is true", () => {
      expect(pastEventsFilter.isActive(createFilters(true))).toBe(false);
    });
  });

  describe("apply", () => {
    it("should return true for future events", () => {
      const event = createEvent(new Date("2024-06-20T10:00:00"));
      expect(pastEventsFilter.apply(event, createFilters(false))).toBe(true);
    });

    it("should return true for today's events", () => {
      const event = createEvent(new Date("2024-06-15T10:00:00"));
      expect(pastEventsFilter.apply(event, createFilters(false))).toBe(true);
    });

    it("should return false for past events", () => {
      const event = createEvent(new Date("2024-06-14T10:00:00"));
      expect(pastEventsFilter.apply(event, createFilters(false))).toBe(false);
    });

    it("should compare by date only, not time", () => {
      const event = createEvent(new Date("2024-06-15T00:00:00"));
      expect(pastEventsFilter.apply(event, createFilters(false))).toBe(true);
    });

    it("should return true for event at end of today", () => {
      const event = createEvent(new Date("2024-06-15T23:59:59"));
      expect(pastEventsFilter.apply(event, createFilters(false))).toBe(true);
    });

    it("should return false for yesterday's event", () => {
      const event = createEvent(new Date("2024-06-14T23:59:59"));
      expect(pastEventsFilter.apply(event, createFilters(false))).toBe(false);
    });

    it("should handle events far in the future", () => {
      const event = createEvent(new Date("2025-12-31T10:00:00"));
      expect(pastEventsFilter.apply(event, createFilters(false))).toBe(true);
    });

    it("should handle events far in the past", () => {
      const event = createEvent(new Date("2020-01-01T10:00:00"));
      expect(pastEventsFilter.apply(event, createFilters(false))).toBe(false);
    });

    it("should return true for tomorrow's event", () => {
      const event = createEvent(new Date("2024-06-16T00:00:00"));
      expect(pastEventsFilter.apply(event, createFilters(false))).toBe(true);
    });

    it("should handle event at exact midnight today", () => {
      const event = createEvent(new Date("2024-06-15T00:00:00"));
      expect(pastEventsFilter.apply(event, createFilters(false))).toBe(true);
    });

    it("should handle event at exact midnight yesterday", () => {
      const event = createEvent(new Date("2024-06-14T00:00:00"));
      expect(pastEventsFilter.apply(event, createFilters(false))).toBe(false);
    });

    it("should handle new year boundary", () => {
      vi.setSystemTime(new Date("2024-01-01T12:00:00"));
      const event = createEvent(new Date("2023-12-31T23:59:59"));
      expect(pastEventsFilter.apply(event, createFilters(false))).toBe(false);
    });
  });
});

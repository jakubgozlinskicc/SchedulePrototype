import { describe, it, expect } from "vitest";
import { DateRangeFilter } from "./DateRangeFilter";
import type { Event } from "../../../../../../../db/scheduleDb";
import type { EventFilters } from "../../../../../context/filtersContext";

describe("DateRangeFilter", () => {
  const dateRangeFilter = new DateRangeFilter();

  const createEvent = (start: Date): Event => ({
    id: 1,
    title: "Test Event",
    description: "Test Description",
    start,
    end: new Date(start.getTime() + 3600000),
    color: "#0000FF",
  });

  const createFilters = (
    dateFrom: Date | null,
    dateTo: Date | null
  ): EventFilters => ({
    searchQuery: "",
    showPastEvents: false,
    dateFrom,
    dateTo,
    colors: [],
  });

  describe("isActive", () => {
    it("should return true when both dates are set", () => {
      const filters = createFilters(
        new Date("2024-06-01"),
        new Date("2024-06-30")
      );
      expect(dateRangeFilter.isActive(filters)).toBe(true);
    });

    it("should return false when dateFrom is null", () => {
      const filters = createFilters(null, new Date("2024-06-30"));
      expect(dateRangeFilter.isActive(filters)).toBe(false);
    });

    it("should return false when dateTo is null", () => {
      const filters = createFilters(new Date("2024-06-01"), null);
      expect(dateRangeFilter.isActive(filters)).toBe(false);
    });

    it("should return false when both dates are null", () => {
      const filters = createFilters(null, null);
      expect(dateRangeFilter.isActive(filters)).toBe(false);
    });
  });

  describe("apply", () => {
    it("should return true when event is within range", () => {
      const event = createEvent(new Date("2024-06-15T10:00:00"));
      const filters = createFilters(
        new Date("2024-06-01"),
        new Date("2024-06-30")
      );
      expect(dateRangeFilter.apply(event, filters)).toBe(true);
    });

    it("should return true when event is on dateFrom", () => {
      const event = createEvent(new Date("2024-06-01T10:00:00"));
      const filters = createFilters(
        new Date("2024-06-01"),
        new Date("2024-06-30")
      );
      expect(dateRangeFilter.apply(event, filters)).toBe(true);
    });

    it("should return true when event is on dateTo", () => {
      const event = createEvent(new Date("2024-06-30T10:00:00"));
      const filters = createFilters(
        new Date("2024-06-01"),
        new Date("2024-06-30")
      );
      expect(dateRangeFilter.apply(event, filters)).toBe(true);
    });

    it("should return false when event is before dateFrom", () => {
      const event = createEvent(new Date("2024-05-31T10:00:00"));
      const filters = createFilters(
        new Date("2024-06-01"),
        new Date("2024-06-30")
      );
      expect(dateRangeFilter.apply(event, filters)).toBe(false);
    });

    it("should return false when event is after dateTo", () => {
      const event = createEvent(new Date("2024-07-01T10:00:00"));
      const filters = createFilters(
        new Date("2024-06-01"),
        new Date("2024-06-30")
      );
      expect(dateRangeFilter.apply(event, filters)).toBe(false);
    });

    it("should return true when no dateFrom filter", () => {
      const event = createEvent(new Date("2024-05-01T10:00:00"));
      const filters = createFilters(null, new Date("2024-06-30"));
      expect(dateRangeFilter.apply(event, filters)).toBe(true);
    });

    it("should return true when no dateTo filter", () => {
      const event = createEvent(new Date("2024-07-15T10:00:00"));
      const filters = createFilters(new Date("2024-06-01"), null);
      expect(dateRangeFilter.apply(event, filters)).toBe(true);
    });

    it("should ignore time when comparing dates", () => {
      const event = createEvent(new Date("2024-06-15T23:59:59"));
      const filters = createFilters(
        new Date("2024-06-15T00:00:00"),
        new Date("2024-06-15T00:00:00")
      );
      expect(dateRangeFilter.apply(event, filters)).toBe(true);
    });

    it("should return true when no filters are set", () => {
      const event = createEvent(new Date("2024-06-15T10:00:00"));
      const filters = createFilters(null, null);
      expect(dateRangeFilter.apply(event, filters)).toBe(true);
    });

    it("should handle single day range", () => {
      const event = createEvent(new Date("2024-06-15T12:00:00"));
      const filters = createFilters(
        new Date("2024-06-15"),
        new Date("2024-06-15")
      );
      expect(dateRangeFilter.apply(event, filters)).toBe(true);
    });

    it("should reject event one day before single day range", () => {
      const event = createEvent(new Date("2024-06-14T12:00:00"));
      const filters = createFilters(
        new Date("2024-06-15"),
        new Date("2024-06-15")
      );
      expect(dateRangeFilter.apply(event, filters)).toBe(false);
    });

    it("should reject event one day after single day range", () => {
      const event = createEvent(new Date("2024-06-16T12:00:00"));
      const filters = createFilters(
        new Date("2024-06-15"),
        new Date("2024-06-15")
      );
      expect(dateRangeFilter.apply(event, filters)).toBe(false);
    });

    it("should handle year boundary", () => {
      const event = createEvent(new Date("2024-12-31T23:59:59"));
      const filters = createFilters(
        new Date("2024-12-01"),
        new Date("2025-01-15")
      );
      expect(dateRangeFilter.apply(event, filters)).toBe(true);
    });

    it("should handle leap year date", () => {
      const event = createEvent(new Date("2024-02-29T10:00:00"));
      const filters = createFilters(
        new Date("2024-02-01"),
        new Date("2024-02-29")
      );
      expect(dateRangeFilter.apply(event, filters)).toBe(true);
    });
  });
});

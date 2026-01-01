import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { filterRegistry } from "./filterRegistry";
import type { Event } from "../../../../../../../db/scheduleDb";
import type { EventFilters } from "../../../../../context/filtersContext";

describe("filterRegistry", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:00:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createEvent = (overrides: Partial<Event> = {}): Event => ({
    id: 1,
    title: "Test Event",
    description: "Test Description",
    start: new Date("2024-06-20T10:00:00"),
    end: new Date("2024-06-20T11:00:00"),
    color: "#0000FF",
    ...overrides,
  });

  const createFilters = (
    overrides: Partial<EventFilters> = {}
  ): EventFilters => ({
    searchQuery: "",
    showPastEvents: true,
    dateFrom: null,
    dateTo: null,
    colors: [],
    ...overrides,
  });

  describe("applyAll", () => {
    it("should return all events when no filters are active", () => {
      const events = [
        createEvent({ id: 1, title: "Event 1" }),
        createEvent({ id: 2, title: "Event 2" }),
      ];
      const filters = createFilters();

      const result = filterRegistry.applyAll(events, filters);

      expect(result).toHaveLength(2);
    });

    it("should filter by search query", () => {
      const events = [
        createEvent({ id: 1, title: "Meeting" }),
        createEvent({ id: 2, title: "Party" }),
      ];
      const filters = createFilters({ searchQuery: "meeting" });

      const result = filterRegistry.applyAll(events, filters);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Meeting");
    });

    it("should filter by date range", () => {
      const events = [
        createEvent({ id: 1, start: new Date("2024-06-15T10:00:00") }),
        createEvent({ id: 2, start: new Date("2024-06-25T10:00:00") }),
      ];
      const filters = createFilters({
        dateFrom: new Date("2024-06-01"),
        dateTo: new Date("2024-06-20"),
      });

      const result = filterRegistry.applyAll(events, filters);

      expect(result).toHaveLength(1);
    });

    it("should filter past events", () => {
      const events = [
        createEvent({ id: 1, start: new Date("2024-06-10T10:00:00") }),
        createEvent({ id: 2, start: new Date("2024-06-20T10:00:00") }),
      ];
      const filters = createFilters({ showPastEvents: false });

      const result = filterRegistry.applyAll(events, filters);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it("should filter by color", () => {
      const events = [
        createEvent({ id: 1, color: "#FF0000" }),
        createEvent({ id: 2, color: "#0000FF" }),
      ];
      const filters = createFilters({ colors: ["red"] });

      const result = filterRegistry.applyAll(events, filters);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it("should apply multiple filters together", () => {
      const events = [
        createEvent({
          id: 1,
          title: "Meeting",
          color: "#FF0000",
          start: new Date("2024-06-20T10:00:00"),
        }),
        createEvent({
          id: 2,
          title: "Party",
          color: "#FF0000",
          start: new Date("2024-06-20T10:00:00"),
        }),
        createEvent({
          id: 3,
          title: "Meeting",
          color: "#0000FF",
          start: new Date("2024-06-20T10:00:00"),
        }),
        createEvent({
          id: 4,
          title: "Meeting",
          color: "#FF0000",
          start: new Date("2024-06-10T10:00:00"),
        }),
      ];
      const filters = createFilters({
        searchQuery: "meeting",
        colors: ["red"],
        showPastEvents: false,
      });

      const result = filterRegistry.applyAll(events, filters);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it("should return empty array when no events match", () => {
      const events = [createEvent({ id: 1, title: "Party" })];
      const filters = createFilters({ searchQuery: "meeting" });

      const result = filterRegistry.applyAll(events, filters);

      expect(result).toHaveLength(0);
    });

    it("should handle empty events array", () => {
      const events: Event[] = [];
      const filters = createFilters({ searchQuery: "meeting" });

      const result = filterRegistry.applyAll(events, filters);

      expect(result).toHaveLength(0);
    });

    it("should include past events when showPastEvents is true", () => {
      const events = [
        createEvent({ id: 1, start: new Date("2024-06-10T10:00:00") }),
        createEvent({ id: 2, start: new Date("2024-06-20T10:00:00") }),
      ];
      const filters = createFilters({ showPastEvents: true });

      const result = filterRegistry.applyAll(events, filters);

      expect(result).toHaveLength(2);
    });

    it("should match multiple colors", () => {
      const events = [
        createEvent({ id: 1, color: "#FF0000" }),
        createEvent({ id: 2, color: "#0000FF" }),
        createEvent({ id: 3, color: "#00FF00" }),
      ];
      const filters = createFilters({ colors: ["red", "blue"] });

      const result = filterRegistry.applyAll(events, filters);

      expect(result).toHaveLength(2);
    });

    it("should apply date range and color filter together", () => {
      const events = [
        createEvent({
          id: 1,
          color: "#FF0000",
          start: new Date("2024-06-15T10:00:00"),
        }),
        createEvent({
          id: 2,
          color: "#FF0000",
          start: new Date("2024-06-25T10:00:00"),
        }),
        createEvent({
          id: 3,
          color: "#0000FF",
          start: new Date("2024-06-15T10:00:00"),
        }),
      ];
      const filters = createFilters({
        colors: ["red"],
        dateFrom: new Date("2024-06-01"),
        dateTo: new Date("2024-06-20"),
      });

      const result = filterRegistry.applyAll(events, filters);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it("should filter by description in search query", () => {
      const events = [
        createEvent({ id: 1, description: "Important project meeting" }),
        createEvent({ id: 2, description: "Casual lunch" }),
      ];
      const filters = createFilters({ searchQuery: "project" });

      const result = filterRegistry.applyAll(events, filters);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it("should handle all filters active simultaneously", () => {
      const events = [
        createEvent({
          id: 1,
          title: "Team Meeting",
          description: "Quarterly review",
          color: "#FF0000",
          start: new Date("2024-06-18T10:00:00"),
        }),
        createEvent({
          id: 2,
          title: "Team Meeting",
          description: "Quarterly review",
          color: "#0000FF",
          start: new Date("2024-06-18T10:00:00"),
        }),
        createEvent({
          id: 3,
          title: "Lunch",
          description: "Quarterly review",
          color: "#FF0000",
          start: new Date("2024-06-18T10:00:00"),
        }),
        createEvent({
          id: 4,
          title: "Team Meeting",
          description: "Quarterly review",
          color: "#FF0000",
          start: new Date("2024-06-10T10:00:00"),
        }),
        createEvent({
          id: 5,
          title: "Team Meeting",
          description: "Quarterly review",
          color: "#FF0000",
          start: new Date("2024-06-25T10:00:00"),
        }),
      ];

      const filters = createFilters({
        searchQuery: "team",
        colors: ["red"],
        showPastEvents: false,
        dateFrom: new Date("2024-06-15"),
        dateTo: new Date("2024-06-20"),
      });

      const result = filterRegistry.applyAll(events, filters);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it("should preserve event order after filtering", () => {
      const events = [
        createEvent({ id: 1, title: "A Meeting" }),
        createEvent({ id: 2, title: "B Party" }),
        createEvent({ id: 3, title: "C Meeting" }),
      ];
      const filters = createFilters({ searchQuery: "meeting" });

      const result = filterRegistry.applyAll(events, filters);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(3);
    });
  });
});

import { describe, it, expect } from "vitest";
import { SearchQuery } from "./SearchQuery";
import type { Event } from "../../../../../../../db/scheduleDb";
import type { EventFilters } from "../../../../../context/filtersContext";

describe("SearchQuery", () => {
  const searchQuery = new SearchQuery();

  const createEvent = (
    title: string,
    description: string = "Default description",
    start: Date = new Date("2024-06-15T10:00:00")
  ): Event => ({
    id: 1,
    title,
    description,
    start,
    end: new Date(start.getTime() + 3600000),
    color: "#0000FF",
  });

  const createFilters = (query: string): EventFilters => ({
    searchQuery: query,
    showPastEvents: false,
    dateFrom: null,
    dateTo: null,
    colors: [],
  });

  describe("isActive", () => {
    it("should return true when search query is not empty", () => {
      expect(searchQuery.isActive(createFilters("test"))).toBe(true);
    });

    it("should return false when search query is empty", () => {
      expect(searchQuery.isActive(createFilters(""))).toBe(false);
    });

    it("should return true for whitespace-only query", () => {
      expect(searchQuery.isActive(createFilters("   "))).toBe(true);
    });
  });

  describe("apply", () => {
    it("should match event by title", () => {
      const event = createEvent("Meeting with team");
      expect(searchQuery.apply(event, createFilters("meeting"))).toBe(true);
    });

    it("should match event by description", () => {
      const event = createEvent("Event", "Discuss project details");
      expect(searchQuery.apply(event, createFilters("project"))).toBe(true);
    });

    it("should be case insensitive", () => {
      const event = createEvent("MEETING");
      expect(searchQuery.apply(event, createFilters("meeting"))).toBe(true);
    });

    it("should match Polish date format", () => {
      const event = createEvent(
        "Event",
        "Description",
        new Date("2024-06-15T10:00:00")
      );
      expect(searchQuery.apply(event, createFilters("15.06.2024"))).toBe(true);
    });

    it("should match ISO date format", () => {
      const event = createEvent(
        "Event",
        "Description",
        new Date("2024-06-15T10:00:00")
      );
      expect(searchQuery.apply(event, createFilters("2024-06-15"))).toBe(true);
    });

    it("should match time", () => {
      const event = createEvent(
        "Event",
        "Description",
        new Date("2024-06-15T10:30:00")
      );
      expect(searchQuery.apply(event, createFilters("10:30"))).toBe(true);
    });

    it("should match Polish day name", () => {
      const event = createEvent(
        "Event",
        "Description",
        new Date("2024-06-15T10:00:00")
      );
      expect(searchQuery.apply(event, createFilters("sobota"))).toBe(true);
    });

    it("should match English day name", () => {
      const event = createEvent(
        "Event",
        "Description",
        new Date("2024-06-15T10:00:00")
      );
      expect(searchQuery.apply(event, createFilters("saturday"))).toBe(true);
    });

    it("should handle diacritics in search", () => {
      const event = createEvent("Spotkanie");
      expect(searchQuery.apply(event, createFilters("spotkanie"))).toBe(true);
    });

    it("should normalize Polish characters ł", () => {
      const event = createEvent("Łódź");
      expect(searchQuery.apply(event, createFilters("lodz"))).toBe(true);
    });

    it("should normalize Polish characters Ł", () => {
      const event = createEvent("ŁÓDŹ");
      expect(searchQuery.apply(event, createFilters("lodz"))).toBe(true);
    });

    it("should normalize Polish characters with diacritics", () => {
      const event = createEvent("Żółć");
      expect(searchQuery.apply(event, createFilters("zolc"))).toBe(true);
    });

    it("should return false when no match", () => {
      const event = createEvent("Meeting");
      expect(searchQuery.apply(event, createFilters("party"))).toBe(false);
    });

    it("should search in description", () => {
      const event = createEvent("Meeting", "Important notes here");
      expect(searchQuery.apply(event, createFilters("notes"))).toBe(true);
    });

    it("should match partial words", () => {
      const event = createEvent("Important Meeting");
      expect(searchQuery.apply(event, createFilters("meet"))).toBe(true);
    });

    it("should match multiple words in title", () => {
      const event = createEvent("Important Team Meeting");
      expect(searchQuery.apply(event, createFilters("team"))).toBe(true);
    });

    it("should handle special characters in query", () => {
      const event = createEvent("Meeting @ Office");
      expect(searchQuery.apply(event, createFilters("@"))).toBe(true);
    });

    it("should match partial description", () => {
      const event = createEvent("Event", "This is a long description");
      expect(searchQuery.apply(event, createFilters("long"))).toBe(true);
    });

    it("should handle empty description in search", () => {
      const event = createEvent("Meeting", "");
      expect(searchQuery.apply(event, createFilters("meeting"))).toBe(true);
    });

    it("should match Monday in Polish", () => {
      const event = createEvent(
        "Event",
        "Description",
        new Date("2024-06-17T10:00:00")
      );
      expect(searchQuery.apply(event, createFilters("poniedzialek"))).toBe(
        true
      );
    });

    it("should match Friday in English", () => {
      const event = createEvent(
        "Event",
        "Description",
        new Date("2024-06-14T10:00:00")
      );
      expect(searchQuery.apply(event, createFilters("friday"))).toBe(true);
    });

    it("should not match unrelated query", () => {
      const event = createEvent("Work meeting", "Discuss quarterly results");
      expect(searchQuery.apply(event, createFilters("vacation"))).toBe(false);
    });
  });
});

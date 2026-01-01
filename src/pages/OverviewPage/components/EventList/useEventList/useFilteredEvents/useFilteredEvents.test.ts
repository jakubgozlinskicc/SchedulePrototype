import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFilteredEvents } from "./useFilteredEvents";
import type { Event } from "../../../../../../db/scheduleDb";

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Meeting",
    description: "Team meeting",
    start: new Date("2025-12-30T10:00:00"),
    end: new Date("2025-12-30T11:00:00"),
    color: "#0000FF",
  },
  {
    id: 2,
    title: "Lunch",
    description: "Lunch break",
    start: new Date("2025-12-31T12:00:00"),
    end: new Date("2025-12-31T13:00:00"),
    color: "#FF0000",
  },
];

const mockFilters = {
  searchQuery: "",
  showPastEvents: false,
  dateFrom: null,
  dateTo: null,
  colors: [],
};

vi.mock(
  "../../../../../../events/useEvents/useEventDataContext/useEventDataContext",
  () => ({
    useEventDataContext: () => ({
      events: mockEvents,
    }),
  })
);

vi.mock("../../../../context/useFiltersContext", () => ({
  useFiltersContext: () => ({
    filters: mockFilters,
  }),
}));

describe("useFilteredEvents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all events when no filters applied", () => {
    const { result } = renderHook(() => useFilteredEvents());

    expect(result.current.filteredEvents).toHaveLength(2);
  });

  it("should sort events by start date", () => {
    const { result } = renderHook(() => useFilteredEvents());

    expect(result.current.filteredEvents[0].start.getTime()).toBeLessThan(
      result.current.filteredEvents[1].start.getTime()
    );
  });

  it("should return filters object", () => {
    const { result } = renderHook(() => useFilteredEvents());

    expect(result.current.filters).toBeDefined();
    expect(result.current.filters).toHaveProperty("searchQuery");
  });
});

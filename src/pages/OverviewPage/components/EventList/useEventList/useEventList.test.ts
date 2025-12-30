import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useEventList } from "./useEventList";
import type { Event } from "../../../../../db/scheduleDb";

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Event 1",
    description: "Test event",
    start: new Date("2025-12-30T10:00:00"),
    end: new Date("2025-12-30T11:00:00"),
    color: "#0000FF",
  },
];

const mockFilters = {
  searchQuery: "",
  showPastEvents: false,
  dateFrom: null,
  dateTo: null,
  colors: [],
};

vi.mock("./useFilteredEvents/useFilteredEvents", () => ({
  useFilteredEvents: () => ({
    filteredEvents: mockEvents,
    filters: mockFilters,
  }),
}));

vi.mock("./useGroupedEvents/useGroupedEvents", () => ({
  useGroupedEvents: (events: Event[]) => ({
    groupedEvents: [
      {
        dateKey: "2025-12-30",
        dateLabel: "Today",
        events,
      },
    ],
    formatTime: (date: Date) => date.toLocaleTimeString(),
  }),
}));

describe("useEventList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return grouped events", () => {
    const { result } = renderHook(() => useEventList());

    expect(result.current.groupedEvents).toHaveLength(1);
    expect(result.current.groupedEvents[0].events).toEqual(mockEvents);
  });

  it("should return formatTime function", () => {
    const { result } = renderHook(() => useEventList());

    expect(typeof result.current.formatTime).toBe("function");
  });

  it("should return pagination object", () => {
    const { result } = renderHook(() => useEventList());

    expect(result.current.pagination).toHaveProperty("currentPage");
    expect(result.current.pagination).toHaveProperty("totalPages");
    expect(result.current.pagination).toHaveProperty("goToPage");
  });
});

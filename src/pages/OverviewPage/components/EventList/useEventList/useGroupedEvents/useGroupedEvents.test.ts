import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useGroupedEvents } from "./useGroupedEvents";
import type { Event } from "../../../../../../db/scheduleDb";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        today: "Today",
        tomorrow: "Tomorrow",
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock("../../../../../../locales/useTranslationContext", () => ({
  useTranslationContext: () => ({
    currentLanguage: "enUS",
  }),
}));

vi.mock("../../../../../../utils/calendarLocalizer/calendarLocalizer", () => ({
  locales: {
    enUS: undefined,
  },
}));

describe("useGroupedEvents", () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should group events by date", () => {
    const events: Event[] = [
      {
        id: 1,
        title: "Event 1",
        description: "Test 1",
        start: new Date(today),
        end: new Date(today),
        color: "#0000FF",
      },
      {
        id: 2,
        title: "Event 2",
        description: "Test 2",
        start: new Date(today),
        end: new Date(today),
        color: "#FF0000",
      },
      {
        id: 3,
        title: "Event 3",
        description: "Test 3",
        start: new Date(tomorrow),
        end: new Date(tomorrow),
        color: "#00FF00",
      },
    ];

    const { result } = renderHook(() => useGroupedEvents(events));

    expect(result.current.groupedEvents).toHaveLength(2);
    expect(result.current.groupedEvents[0].events).toHaveLength(2);
    expect(result.current.groupedEvents[1].events).toHaveLength(1);
  });

  it("should format today as 'Today'", () => {
    const events: Event[] = [
      {
        id: 1,
        title: "Event",
        description: "Test",
        start: new Date(today),
        end: new Date(today),
        color: "#0000FF",
      },
    ];

    const { result } = renderHook(() => useGroupedEvents(events));

    expect(result.current.groupedEvents[0].dateLabel).toBe("Today");
  });

  it("should format tomorrow as 'Tomorrow'", () => {
    const events: Event[] = [
      {
        id: 1,
        title: "Event",
        description: "Test",
        start: new Date(tomorrow),
        end: new Date(tomorrow),
        color: "#0000FF",
      },
    ];

    const { result } = renderHook(() => useGroupedEvents(events));

    expect(result.current.groupedEvents[0].dateLabel).toBe("Tomorrow");
  });

  it("should format other dates with full date string", () => {
    const events: Event[] = [
      {
        id: 1,
        title: "Event",
        description: "Test",
        start: new Date(nextWeek),
        end: new Date(nextWeek),
        color: "#0000FF",
      },
    ];

    const { result } = renderHook(() => useGroupedEvents(events));

    expect(result.current.groupedEvents[0].dateLabel).not.toBe("Today");
    expect(result.current.groupedEvents[0].dateLabel).not.toBe("Tomorrow");
    expect(result.current.groupedEvents[0].dateLabel).toMatch(/\d{4}/);
  });

  it("should format time correctly", () => {
    const events: Event[] = [
      {
        id: 1,
        title: "Event",
        description: "Test",
        start: new Date("2025-12-30T14:30:00"),
        end: new Date("2025-12-30T15:45:00"),
        color: "#0000FF",
      },
    ];

    const { result } = renderHook(() => useGroupedEvents(events));

    const formattedStart = result.current.formatTime(events[0].start);
    const formattedEnd = result.current.formatTime(events[0].end);

    expect(formattedStart).toMatch(/14:30/);
    expect(formattedEnd).toMatch(/15:45/);
  });

  it("should return empty array for empty input", () => {
    const { result } = renderHook(() => useGroupedEvents([]));

    expect(result.current.groupedEvents).toEqual([]);
  });

  it("should create unique dateKeys", () => {
    const events: Event[] = [
      {
        id: 1,
        title: "Event 1",
        description: "Test 1",
        start: new Date("2025-12-30T10:00:00"),
        end: new Date("2025-12-30T11:00:00"),
        color: "#0000FF",
      },
      {
        id: 2,
        title: "Event 2",
        description: "Test 2",
        start: new Date("2025-12-31T10:00:00"),
        end: new Date("2025-12-31T11:00:00"),
        color: "#FF0000",
      },
    ];

    const { result } = renderHook(() => useGroupedEvents(events));

    expect(result.current.groupedEvents[0].dateKey).toBe("2025-12-30");
    expect(result.current.groupedEvents[1].dateKey).toBe("2025-12-31");
  });
});

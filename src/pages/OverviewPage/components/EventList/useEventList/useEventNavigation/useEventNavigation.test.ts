import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useEventNavigation } from "./useEventNavigation";
import type { Event } from "../../../../../../db/scheduleDb";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const mockSingleEvent: Event = {
  id: 1,
  title: "Single Event",
  description: "",
  start: new Date("2025-01-15T10:00:00"),
  end: new Date("2025-01-15T11:00:00"),
  color: "#0000FF",
  recurrenceRule: { type: "none", interval: 1 },
};

const mockRecurringEventWithId: Event = {
  id: 2,
  title: "Recurring Event",
  description: "",
  start: new Date("2025-01-15T10:00:00"),
  end: new Date("2025-01-15T11:00:00"),
  color: "#FF0000",
  recurrenceRule: { type: "daily", interval: 1 },
};

const mockExpandedRecurringEvent: Event = {
  id: undefined,
  recurringEventId: 2,
  title: "Expanded Recurring Event",
  description: "",
  start: new Date("2025-01-16T10:00:00"),
  end: new Date("2025-01-16T11:00:00"),
  color: "#FF0000",
  recurrenceRule: { type: "daily", interval: 1 },
};

const mockRecurringEventWithNoneType: Event = {
  id: 3,
  title: "Event with none recurrence",
  description: "",
  start: new Date("2025-01-15T10:00:00"),
  end: new Date("2025-01-15T11:00:00"),
  color: "#00FF00",
  recurrenceRule: { type: "none", interval: 1 },
};

describe("useEventNavigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("handleEditClick", () => {
    it("should navigate to single event edit page for event with id and no recurrence", () => {
      const { result } = renderHook(() => useEventNavigation());

      result.current.handleEditClick(mockSingleEvent);

      expect(mockNavigate).toHaveBeenCalledWith("/event/edit/1");
    });

    it("should navigate to single event edit page for event with id and recurrence type 'none'", () => {
      const { result } = renderHook(() => useEventNavigation());

      result.current.handleEditClick(mockRecurringEventWithNoneType);

      expect(mockNavigate).toHaveBeenCalledWith("/event/edit/3");
    });

    it("should navigate to recurring event edit page for event with id and recurrence type other than 'none'", () => {
      const { result } = renderHook(() => useEventNavigation());

      result.current.handleEditClick(mockRecurringEventWithId);

      const expectedDateStr = encodeURIComponent(
        mockRecurringEventWithId.start.toISOString()
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        `/recurring-event/edit/2/${expectedDateStr}`
      );
    });

    it("should navigate to recurring event edit page using recurringEventId for expanded event without id", () => {
      const { result } = renderHook(() => useEventNavigation());

      result.current.handleEditClick(mockExpandedRecurringEvent);

      const expectedDateStr = encodeURIComponent(
        mockExpandedRecurringEvent.start.toISOString()
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        `/recurring-event/edit/2/${expectedDateStr}`
      );
    });

    it("should properly encode date string in URL", () => {
      const { result } = renderHook(() => useEventNavigation());

      const eventWithSpecialDate: Event = {
        id: 5,
        title: "Special Date Event",
        description: "",
        start: new Date("2025-12-31T23:59:59.999Z"),
        end: new Date("2026-01-01T00:59:59.999Z"),
        color: "#0000FF",
        recurrenceRule: { type: "weekly", interval: 1 },
      };

      result.current.handleEditClick(eventWithSpecialDate);

      const expectedDateStr = encodeURIComponent(
        eventWithSpecialDate.start.toISOString()
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        `/recurring-event/edit/5/${expectedDateStr}`
      );
      expect(expectedDateStr).toContain("%3A");
    });

    it("should handle monthly recurring event", () => {
      const { result } = renderHook(() => useEventNavigation());

      const monthlyEvent: Event = {
        id: 7,
        title: "Monthly Event",
        description: "",
        start: new Date("2025-01-15T10:00:00"),
        end: new Date("2025-01-15T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "monthly", interval: 1 },
      };

      result.current.handleEditClick(monthlyEvent);

      const expectedDateStr = encodeURIComponent(
        monthlyEvent.start.toISOString()
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        `/recurring-event/edit/7/${expectedDateStr}`
      );
    });

    it("should handle yearly recurring event", () => {
      const { result } = renderHook(() => useEventNavigation());

      const yearlyEvent: Event = {
        id: 8,
        title: "Yearly Event",
        description: "",
        start: new Date("2025-01-15T10:00:00"),
        end: new Date("2025-01-15T11:00:00"),
        color: "#0000FF",
        recurrenceRule: { type: "yearly", interval: 1 },
      };

      result.current.handleEditClick(yearlyEvent);

      const expectedDateStr = encodeURIComponent(
        yearlyEvent.start.toISOString()
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        `/recurring-event/edit/8/${expectedDateStr}`
      );
    });
  });

  describe("hook return value", () => {
    it("should return handleEditClick function", () => {
      const { result } = renderHook(() => useEventNavigation());

      expect(result.current).toHaveProperty("handleEditClick");
      expect(typeof result.current.handleEditClick).toBe("function");
    });
  });
});

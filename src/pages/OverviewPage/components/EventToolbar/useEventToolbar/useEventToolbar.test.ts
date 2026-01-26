import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEventToolbar } from "./useEventToolbar";
import {
  addDays,
  addWeeks,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
} from "date-fns";
import toast from "react-hot-toast";

const mockUpdateFilter = vi.fn();
let mockFilters = {
  dateFrom: null as Date | null,
  dateTo: null as Date | null,
};

vi.mock("../../../context/useFiltersContext", () => ({
  useFiltersContext: () => ({
    filters: mockFilters,
    updateFilter: mockUpdateFilter,
  }),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("useEventToolbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:00:00"));
    mockFilters = { dateFrom: null, dateTo: null };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("currentView", () => {
    it("should default to 'day' view", () => {
      const { result } = renderHook(() => useEventToolbar());

      expect(result.current.currentView).toBe("day");
    });
  });

  describe("setToday", () => {
    it("should set dateFrom and dateTo to today's range based on current view", () => {
      const { result } = renderHook(() => useEventToolbar());
      const today = new Date("2024-06-15T12:00:00");

      act(() => {
        result.current.setToday();
      });

      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        startOfDay(today)
      );
      expect(mockUpdateFilter).toHaveBeenCalledWith("dateTo", endOfDay(today));
    });

    it("should set week range when view is week", () => {
      const { result } = renderHook(() => useEventToolbar());
      const today = new Date("2024-06-15T12:00:00");
      mockFilters = { dateFrom: today, dateTo: today };

      act(() => {
        result.current.changeView("week");
      });

      vi.clearAllMocks();

      act(() => {
        result.current.setToday();
      });

      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        startOfWeek(today, { weekStartsOn: 1 })
      );
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateTo",
        endOfWeek(today, { weekStartsOn: 1 })
      );
    });

    it("should set month range when view is month", () => {
      const { result } = renderHook(() => useEventToolbar());
      const today = new Date("2024-06-15T12:00:00");
      mockFilters = { dateFrom: today, dateTo: today };

      act(() => {
        result.current.changeView("month");
      });

      vi.clearAllMocks();

      act(() => {
        result.current.setToday();
      });

      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        startOfMonth(today)
      );
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateTo",
        endOfMonth(today)
      );
    });

    it("should be called twice for both date filters", () => {
      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.setToday();
      });

      expect(mockUpdateFilter).toHaveBeenCalledTimes(2);
    });
  });

  describe("handleNext", () => {
    it("should advance by 1 day when view is day", () => {
      const currentDate = new Date("2024-06-15");
      mockFilters = { dateFrom: currentDate, dateTo: currentDate };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.handleNext();
      });

      const nextDay = addDays(currentDate, 1);
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        startOfDay(nextDay)
      );
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateTo",
        endOfDay(nextDay)
      );
    });

    it("should advance by 1 week when view is week", () => {
      const currentDate = new Date("2024-06-15");
      mockFilters = { dateFrom: currentDate, dateTo: currentDate };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.changeView("week");
      });

      vi.clearAllMocks();

      act(() => {
        result.current.handleNext();
      });

      const nextWeek = addWeeks(currentDate, 1);
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        startOfWeek(nextWeek, { weekStartsOn: 1 })
      );
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateTo",
        endOfWeek(nextWeek, { weekStartsOn: 1 })
      );
    });

    it("should advance by 1 month when view is month", () => {
      const currentDate = new Date("2024-06-15");
      mockFilters = { dateFrom: currentDate, dateTo: currentDate };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.changeView("month");
      });

      vi.clearAllMocks();

      act(() => {
        result.current.handleNext();
      });

      const nextMonth = addMonths(currentDate, 1);
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        startOfMonth(nextMonth)
      );
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateTo",
        endOfMonth(nextMonth)
      );
    });

    it("should show toast error when dates are not selected", () => {
      mockFilters = { dateFrom: null, dateTo: null };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.handleNext();
      });

      expect(toast.error).toHaveBeenCalledWith("toast-error-select-date", {
        id: "date-error",
      });
    });

    it("should not update filters when validation fails", () => {
      mockFilters = { dateFrom: null, dateTo: null };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.handleNext();
      });

      expect(mockUpdateFilter).not.toHaveBeenCalled();
    });
  });

  describe("handlePrevious", () => {
    it("should go back 1 day when view is day", () => {
      const currentDate = new Date("2024-06-15");
      mockFilters = { dateFrom: currentDate, dateTo: currentDate };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.handlePrevious();
      });

      const prevDay = addDays(currentDate, -1);
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        startOfDay(prevDay)
      );
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateTo",
        endOfDay(prevDay)
      );
    });

    it("should go back 1 week when view is week", () => {
      const currentDate = new Date("2024-06-15");
      mockFilters = { dateFrom: currentDate, dateTo: currentDate };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.changeView("week");
      });

      vi.clearAllMocks();

      act(() => {
        result.current.handlePrevious();
      });

      const prevWeek = addWeeks(currentDate, -1);
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        startOfWeek(prevWeek, { weekStartsOn: 1 })
      );
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateTo",
        endOfWeek(prevWeek, { weekStartsOn: 1 })
      );
    });

    it("should go back 1 month when view is month", () => {
      const currentDate = new Date("2024-06-15");
      mockFilters = { dateFrom: currentDate, dateTo: currentDate };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.changeView("month");
      });

      vi.clearAllMocks();

      act(() => {
        result.current.handlePrevious();
      });

      const prevMonth = addMonths(currentDate, -1);
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        startOfMonth(prevMonth)
      );
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateTo",
        endOfMonth(prevMonth)
      );
    });

    it("should show toast error when dates are not selected", () => {
      mockFilters = { dateFrom: null, dateTo: null };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.handlePrevious();
      });

      expect(toast.error).toHaveBeenCalledWith("toast-error-select-date", {
        id: "date-error",
      });
    });

    it("should handle going back across month boundary", () => {
      const currentDate = new Date("2024-06-01");
      mockFilters = { dateFrom: currentDate, dateTo: currentDate };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.handlePrevious();
      });

      const prevDay = addDays(currentDate, -1);
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        startOfDay(prevDay)
      );
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateTo",
        endOfDay(prevDay)
      );
    });
  });

  describe("changeView", () => {
    it("should change view to month and update date range", () => {
      const currentDate = new Date("2024-06-15");
      mockFilters = { dateFrom: currentDate, dateTo: currentDate };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.changeView("month");
      });

      expect(result.current.currentView).toBe("month");
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        startOfMonth(currentDate)
      );
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateTo",
        endOfMonth(currentDate)
      );
    });

    it("should change view to week and update date range", () => {
      const currentDate = new Date("2024-06-15");
      mockFilters = { dateFrom: currentDate, dateTo: currentDate };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.changeView("week");
      });

      expect(result.current.currentView).toBe("week");
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        startOfWeek(currentDate, { weekStartsOn: 1 })
      );
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateTo",
        endOfWeek(currentDate, { weekStartsOn: 1 })
      );
    });

    it("should change view to day and update date range", () => {
      const currentDate = new Date("2024-06-15T12:30:00");
      mockFilters = { dateFrom: currentDate, dateTo: currentDate };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.changeView("month");
      });

      vi.clearAllMocks();

      act(() => {
        result.current.changeView("day");
      });

      expect(result.current.currentView).toBe("day");
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        startOfDay(currentDate)
      );
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateTo",
        endOfDay(currentDate)
      );
    });

    it("should use current date when dateFrom is null", () => {
      mockFilters = { dateFrom: null, dateTo: null };
      const today = new Date("2024-06-15T12:00:00");

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.changeView("month");
      });

      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        startOfMonth(today)
      );
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateTo",
        endOfMonth(today)
      );
    });

    it("should handle February correctly in month view", () => {
      const currentDate = new Date("2024-02-15");
      mockFilters = { dateFrom: currentDate, dateTo: currentDate };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.changeView("month");
      });

      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        startOfMonth(currentDate)
      );
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateTo",
        endOfMonth(currentDate)
      );
    });
  });

  describe("integration scenarios", () => {
    it("should navigate correctly after changing view", () => {
      const currentDate = new Date("2024-06-15");
      mockFilters = { dateFrom: currentDate, dateTo: currentDate };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.changeView("month");
      });

      vi.clearAllMocks();

      act(() => {
        result.current.handleNext();
      });

      const nextMonth = addMonths(currentDate, 1);
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        startOfMonth(nextMonth)
      );
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateTo",
        endOfMonth(nextMonth)
      );
    });

    it("should maintain view state across multiple navigations", () => {
      const currentDate = new Date("2024-06-15");
      mockFilters = { dateFrom: currentDate, dateTo: currentDate };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.changeView("week");
      });

      expect(result.current.currentView).toBe("week");

      act(() => {
        result.current.handleNext();
      });

      expect(result.current.currentView).toBe("week");

      act(() => {
        result.current.handlePrevious();
      });

      expect(result.current.currentView).toBe("week");
    });

    it("should use fallback date when filters are empty on setToday", () => {
      mockFilters = { dateFrom: null, dateTo: null };
      const today = new Date("2024-06-15T12:00:00");

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.setToday();
      });

      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        startOfDay(today)
      );
      expect(mockUpdateFilter).toHaveBeenCalledWith("dateTo", endOfDay(today));
    });
  });
});

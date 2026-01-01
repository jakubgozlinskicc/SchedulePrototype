import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEventToolbar } from "./useEventToolbar";
import {
  addDays,
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

  describe("setToday", () => {
    it("should set dateFrom and dateTo to today with time reset to midnight", () => {
      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.setToday();
      });

      const expectedDate = new Date("2024-06-15T00:00:00");
      expect(mockUpdateFilter).toHaveBeenCalledWith("dateFrom", expectedDate);
      expect(mockUpdateFilter).toHaveBeenCalledWith("dateTo", expectedDate);
    });

    it("should be called twice for both date filters", () => {
      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.setToday();
      });

      expect(mockUpdateFilter).toHaveBeenCalledTimes(2);
    });
  });

  describe("handleNextDay", () => {
    it("should advance both dates by 1 day", () => {
      const currentDate = new Date("2024-06-15");
      mockFilters = { dateFrom: currentDate, dateTo: currentDate };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.handleNextDay();
      });

      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        addDays(currentDate, 1)
      );
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateTo",
        addDays(currentDate, 1)
      );
    });

    it("should show toast error when dates are not selected", () => {
      mockFilters = { dateFrom: null, dateTo: null };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.handleNextDay();
      });

      expect(toast.error).toHaveBeenCalledWith("toast-error-select-date", {
        id: "date-error",
      });
    });

    it("should only update dateFrom if dateTo is null", () => {
      const currentDate = new Date("2024-06-15");
      mockFilters = { dateFrom: currentDate, dateTo: null };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.handleNextDay();
      });

      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        addDays(currentDate, 1)
      );
      expect(mockUpdateFilter).toHaveBeenCalledTimes(1);
    });

    it("should only update dateTo if dateFrom is null", () => {
      const currentDate = new Date("2024-06-15");
      mockFilters = { dateFrom: null, dateTo: currentDate };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.handleNextDay();
      });

      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateTo",
        addDays(currentDate, 1)
      );
      expect(mockUpdateFilter).toHaveBeenCalledTimes(1);
    });
  });

  describe("handlePreviousDay", () => {
    it("should go back 1 day for both dates", () => {
      const currentDate = new Date("2024-06-15");
      mockFilters = { dateFrom: currentDate, dateTo: currentDate };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.handlePreviousDay();
      });

      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        addDays(currentDate, -1)
      );
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateTo",
        addDays(currentDate, -1)
      );
    });

    it("should show toast error when dates are not selected", () => {
      mockFilters = { dateFrom: null, dateTo: null };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.handlePreviousDay();
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
        result.current.handlePreviousDay();
      });

      const expectedDate = new Date("2024-05-31");
      expect(mockUpdateFilter).toHaveBeenCalledWith("dateFrom", expectedDate);
    });
  });

  describe("setCurrentMonthRange", () => {
    it("should set date range to current month", () => {
      const currentDate = new Date("2024-06-15");
      mockFilters = { dateFrom: currentDate, dateTo: currentDate };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.setCurrentMonthRange();
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

    it("should not update if dateFrom is null", () => {
      mockFilters = { dateFrom: null, dateTo: null };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.setCurrentMonthRange();
      });

      expect(mockUpdateFilter).not.toHaveBeenCalled();
    });

    it("should handle February correctly", () => {
      const currentDate = new Date("2024-02-15");
      mockFilters = { dateFrom: currentDate, dateTo: currentDate };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.setCurrentMonthRange();
      });

      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        new Date("2024-02-01T00:00:00")
      );
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateTo",
        endOfMonth(currentDate)
      );
    });
  });

  describe("setCurrentWeekRange", () => {
    it("should set date range to current week starting on Monday", () => {
      const currentDate = new Date("2024-06-15");
      mockFilters = { dateFrom: currentDate, dateTo: currentDate };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.setCurrentWeekRange();
      });

      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        startOfWeek(currentDate, { weekStartsOn: 1 })
      );
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateTo",
        endOfWeek(currentDate, { weekStartsOn: 1 })
      );
    });

    it("should not update if dateFrom is null", () => {
      mockFilters = { dateFrom: null, dateTo: null };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.setCurrentWeekRange();
      });

      expect(mockUpdateFilter).not.toHaveBeenCalled();
    });
  });

  describe("setCurrentDayRange", () => {
    it("should set date range to current day", () => {
      const currentDate = new Date("2024-06-15T12:30:00");
      mockFilters = { dateFrom: currentDate, dateTo: currentDate };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.setCurrentDayRange();
      });

      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateFrom",
        startOfDay(currentDate)
      );
      expect(mockUpdateFilter).toHaveBeenCalledWith(
        "dateTo",
        endOfDay(currentDate)
      );
    });

    it("should not update if dateFrom is null", () => {
      mockFilters = { dateFrom: null, dateTo: null };

      const { result } = renderHook(() => useEventToolbar());

      act(() => {
        result.current.setCurrentDayRange();
      });

      expect(mockUpdateFilter).not.toHaveBeenCalled();
    });
  });
});

import {
  addDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useFiltersContext } from "../../../context/useFiltersContext";

export function useEventToolbar() {
  const { filters, updateFilter } = useFiltersContext();

  const setToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    updateFilter("dateFrom", today);
    updateFilter("dateTo", today);
  };

  const handleNextDay = () => {
    if (filters.dateFrom) {
      const nextFromDay = addDays(filters.dateFrom, 1);
      updateFilter("dateFrom", nextFromDay);
    }
    if (filters.dateTo) {
      const nextToDay = addDays(filters.dateTo, 1);
      updateFilter("dateTo", nextToDay);
    }
  };

  const handlePreviousDay = () => {
    if (filters.dateFrom) {
      const nextFromDay = addDays(filters.dateFrom, -1);
      updateFilter("dateFrom", nextFromDay);
    }
    if (filters.dateTo) {
      const nextToDay = addDays(filters.dateTo, -1);
      updateFilter("dateTo", nextToDay);
    }
  };

  const setCurrentMonthRange = () => {
    if (filters.dateFrom) {
      const currentDate = filters.dateFrom;
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);

      updateFilter("dateFrom", start);
      updateFilter("dateTo", end);
    }
  };

  const setCurrentWeekRange = () => {
    if (filters.dateFrom) {
      const currentDate = filters.dateFrom;
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });

      updateFilter("dateFrom", start);
      updateFilter("dateTo", end);
    }
  };

  const setCurrentDayRange = () => {
    if (filters.dateFrom) {
      const currentDate = filters.dateFrom;
      const start = startOfDay(currentDate);
      const end = endOfDay(currentDate);

      updateFilter("dateFrom", start);
      updateFilter("dateTo", end);
    }
  };
  return {
    setToday,
    handleNextDay,
    handlePreviousDay,
    setCurrentDayRange,
    setCurrentWeekRange,
    setCurrentMonthRange,
  };
}

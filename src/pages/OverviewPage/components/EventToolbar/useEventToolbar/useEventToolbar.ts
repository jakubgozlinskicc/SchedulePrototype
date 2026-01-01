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
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function useEventToolbar() {
  const { filters, updateFilter } = useFiltersContext();
  const { t } = useTranslation();

  const setToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    updateFilter("dateFrom", today);
    updateFilter("dateTo", today);
  };

  const toastDateError = () => {
    if (!filters.dateFrom && !filters.dateTo) {
      toast.error(t("toast-error-select-date"), {
        id: "date-error",
      });
      return;
    }
  };

  const handleNextDay = () => {
    toastDateError();
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
    toastDateError();

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
    toastDateError();
    if (filters.dateFrom) {
      const currentDate = filters.dateFrom;
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);

      updateFilter("dateFrom", start);
      updateFilter("dateTo", end);
    }
  };

  const setCurrentWeekRange = () => {
    toastDateError();
    if (filters.dateFrom) {
      const currentDate = filters.dateFrom;
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });

      updateFilter("dateFrom", start);
      updateFilter("dateTo", end);
    }
  };

  const setCurrentDayRange = () => {
    toastDateError();
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

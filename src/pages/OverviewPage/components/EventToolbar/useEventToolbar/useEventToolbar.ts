import { useState } from "react";
import { useFiltersContext } from "../../../context/useFiltersContext";
import { rangeChangeStrategyRegistry } from "./rangeChangeStrategies/rangeChangeStrategyRegistry";
import type {
  ViewOption,
  DateRange,
} from "./rangeChangeStrategies/rangeChangeTypes";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function useEventToolbar() {
  const { filters, updateFilter } = useFiltersContext();
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState<ViewOption>("day");

  const updateDateRange = ({ dateFrom, dateTo }: DateRange) => {
    updateFilter("dateFrom", dateFrom);
    updateFilter("dateTo", dateTo);
  };

  const getCurrentDate = (): Date => filters.dateFrom ?? new Date();

  const validateDates = (): boolean => {
    if (!filters.dateFrom && !filters.dateTo) {
      toast.error(t("toast-error-select-date"), { id: "date-error" });
      return false;
    }
    return true;
  };

  const setToday = () => {
    const range = rangeChangeStrategyRegistry.getCurrentRange(
      currentView,
      new Date()
    );
    updateDateRange(range);
  };

  const handleNext = () => {
    if (!validateDates()) return;
    const range = rangeChangeStrategyRegistry.getNextRange(
      currentView,
      getCurrentDate()
    );
    updateDateRange(range);
  };

  const handlePrevious = () => {
    if (!validateDates()) return;
    const range = rangeChangeStrategyRegistry.getPreviousRange(
      currentView,
      getCurrentDate()
    );
    updateDateRange(range);
  };

  const changeView = (view: ViewOption) => {
    setCurrentView(view);
    const range = rangeChangeStrategyRegistry.getCurrentRange(
      view,
      getCurrentDate()
    );
    updateDateRange(range);
  };

  return {
    currentView,
    setToday,
    handleNext,
    handlePrevious,
    changeView,
  };
}

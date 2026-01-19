import { useState, type ReactNode } from "react";
import { FiltersContext, type EventFilters } from "./filtersContext";
import { resetTime } from "../components/EventList/useEventList/useFilteredEvents/resetTime";

interface FiltersProviderProps {
  children: ReactNode;
}

const defaultFilters: EventFilters = {
  dateFrom: null,
  dateTo: null,
  searchQuery: "",
  showPastEvents: false,
  colors: [],
};

export function FiltersProvider({ children }: FiltersProviderProps) {
  const [filters, setFilters] = useState<EventFilters>(defaultFilters);

  const updateFilter = <K extends keyof EventFilters>(
    key: K,
    value: EventFilters[K]
  ) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      if (key === "dateFrom" && value) {
        const fromDate = resetTime(new Date(value as Date));
        const today = resetTime(new Date());

        if (fromDate < today && !prev.showPastEvents) {
          newFilters.showPastEvents = true;
        }

        if (fromDate > today && prev.showPastEvents) {
          newFilters.showPastEvents = false;
        }
      }
      return newFilters;
    });
  };

  const resetFilters = () => setFilters(defaultFilters);

  const activeFiltersCount = [
    filters.searchQuery,
    filters.showPastEvents,
    filters.dateFrom,
    filters.dateTo,
    filters.colors.length > 0,
  ].filter(Boolean).length;

  const value = {
    filters,
    activeFiltersCount,
    setFilters,
    updateFilter,
    resetFilters,
  };

  return (
    <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
  );
}

import { useState, type ReactNode } from "react";
import { FiltersContext, type EventFilters } from "./filtersContext";

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
    setFilters((prev) => ({ ...prev, [key]: value }));
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

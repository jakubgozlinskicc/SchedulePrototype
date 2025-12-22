import { useState, type ReactNode } from "react";
import { FiltersContext, type EventFilters } from "./filtersContext";

interface FiltersProviderProps {
  children: ReactNode;
}

const defaultFilters: EventFilters = {
  dateFrom: new Date(),
  dateTo: null,
  searchQuery: "",
  showPastEvents: false,
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

  const value = {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
  };

  return (
    <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
  );
}

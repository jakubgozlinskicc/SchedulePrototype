import { createContext } from "react";

export interface EventFilters {
  dateFrom: Date | null;
  dateTo: Date | null;
  searchQuery: string;
  showPastEvents: boolean;
  colors: string[];
}

export interface FiltersContextType {
  filters: EventFilters;
  activeFiltersCount: number;
  updateFilter: <K extends keyof EventFilters>(
    key: K,
    value: EventFilters[K]
  ) => void;
  resetFilters: () => void;
}

export const FiltersContext = createContext<FiltersContextType | undefined>(
  undefined
);

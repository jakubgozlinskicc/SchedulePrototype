import { createContext } from "react";

export interface EventFilters {
  dateFrom: Date | null;
  dateTo: Date | null;
  searchQuery: string;
  showPastEvents: boolean;
}

export interface FiltersContextType {
  filters: EventFilters;
  setFilters: React.Dispatch<React.SetStateAction<EventFilters>>;
  updateFilter: <K extends keyof EventFilters>(
    key: K,
    value: EventFilters[K]
  ) => void;
  resetFilters: () => void;
}

export const FiltersContext = createContext<FiltersContextType | undefined>(
  undefined
);

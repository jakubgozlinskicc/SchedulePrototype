import { useContext } from "react";
import { FiltersContext } from "./filtersContext";

export function useFiltersContext() {
  const context = useContext(FiltersContext);

  if (context === undefined) {
    throw new Error("useFiltersContext must be used within FiltersProvider");
  }

  return context;
}

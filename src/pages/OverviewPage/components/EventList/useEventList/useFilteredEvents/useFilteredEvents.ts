import { useFiltersContext } from "../../../../context/useFiltersContext";
import { filterRegistry } from "./strategies/filterRegistry";
import type { Event } from "../../../../../../db/scheduleDb";

export function useFilteredEvents(events: Event[]) {
  const { filters } = useFiltersContext();

  const filtered = filterRegistry
    .applyAll(events, filters)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  return { filteredEvents: filtered, filters };
}

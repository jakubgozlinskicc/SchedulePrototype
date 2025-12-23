import { useEventDataContext } from "../../../../../../events/useEvents/useEventDataContext/useEventDataContext";
import { useFiltersContext } from "../../../../context/useFiltersContext";
import { filterRegistry } from "./strategies/FilterRegistry";

export function useFilteredEvents() {
  const { events } = useEventDataContext();
  const { filters } = useFiltersContext();

  const filtered = filterRegistry
    .applyAll(events, filters)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  return { filteredEvents: filtered, filters };
}

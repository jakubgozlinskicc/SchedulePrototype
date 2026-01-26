import { resetTime } from "../components/EventList/useEventList/useFilteredEvents/resetTime";
import type { EventFilters } from "./filtersContext";

export function applyFilterAutoUpdates<K extends keyof EventFilters>(
  key: K,
  value: EventFilters[K],
  prevFilters: EventFilters,
): Partial<EventFilters> {
  const updatedFilters: Partial<EventFilters> = {};
  const today = resetTime(new Date());

  if (key === "dateFrom" && value) {
    const fromDate = resetTime(new Date(value as Date));
    if (fromDate < today && !prevFilters.showPastEvents) {
      updatedFilters.showPastEvents = true;
    }
    if (fromDate >= today && prevFilters.showPastEvents) {
      updatedFilters.showPastEvents = false;
    }
  }
  if (key === "dateTo" && value) {
    const toDate = resetTime(new Date(value as Date));
    if (toDate < today && !prevFilters.showPastEvents) {
      updatedFilters.showPastEvents = true;
    }
  }
  return updatedFilters;
}

import type { Event } from "../../../../../../../db/scheduleDb";
import type { EventFilters } from "../../../../../context/filtersContext";

export interface IFilterStrategy {
  isActive(filters: EventFilters): boolean;
  apply(event: Event, filters: EventFilters): boolean;
}

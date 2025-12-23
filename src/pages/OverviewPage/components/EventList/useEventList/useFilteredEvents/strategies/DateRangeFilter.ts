import type { Event } from "../../../../../../../db/scheduleDb";
import type { EventFilters } from "../../../../../context/filtersContext";
import { resetTime } from "../resetTime";
import type { IFilterStrategy } from "./IFilterStrategy";

export class DateRangeFilter implements IFilterStrategy {
  isActive(filters: EventFilters): boolean {
    return !!(filters.dateFrom && filters.dateTo);
  }

  apply(event: Event, filters: EventFilters): boolean {
    const eventDate = resetTime(new Date(event.start));
    if (filters.dateFrom && eventDate < resetTime(filters.dateFrom))
      return false;
    if (filters.dateTo && eventDate > resetTime(filters.dateTo)) return false;

    return true;
  }
}

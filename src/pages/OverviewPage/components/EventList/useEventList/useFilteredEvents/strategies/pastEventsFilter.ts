import type { Event } from "../../../../../../../db/scheduleDb";
import type { EventFilters } from "../../../../../context/filtersContext";
import { resetTime } from "../resetTime";
import type { IFilterStrategy } from "./IFilterStrategy";

export class PastEventsFilter implements IFilterStrategy {
  isActive(filters: EventFilters): boolean {
    return !filters.showPastEvents;
  }

  apply(event: Event): boolean {
    const eventDate = resetTime(new Date(event.start));
    const now = resetTime(new Date());
    return eventDate >= now;
  }
}

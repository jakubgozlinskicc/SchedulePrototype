import type { EventFilters } from "../../../../../context/filtersContext";
import type { IFilterStrategy } from "./IFilterStrategy";
import type { Event } from "../../../../../../../db/scheduleDb";
import { DateRangeFilter } from "./DateRangeFilter";
import { PastEventsFilter } from "./PastEventsFilter";
import { SearchQuery } from "./SearchQuery";

const strategies: IFilterStrategy[] = [
  new DateRangeFilter(),
  new PastEventsFilter(),
  new SearchQuery(),
];

export const filterRegistry = {
  applyAll(events: Event[], filters: EventFilters): Event[] {
    const activeStrategies = strategies.filter((s) => s.isActive(filters));

    return events.filter((event) =>
      activeStrategies.every((strategy) => strategy.apply(event, filters))
    );
  },
};

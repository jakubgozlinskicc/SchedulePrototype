import { useEffect, useRef } from "react";
import { useFilteredEvents } from "./useFilteredEvents/useFilteredEvents";
import { useGroupedEvents } from "./useGroupedEvents/useGroupedEvents";
import { usePagination } from "../../Pagination/usePagination/usePagination";

export function useEventList() {
  const { filteredEvents, filters } = useFilteredEvents();
  const ITEMS_PER_PAGE = 10;

  const pagination = usePagination({
    totalItems: filteredEvents.length,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const prevFiltersRef = useRef(filters);

  useEffect(() => {
    if (prevFiltersRef.current !== filters) {
      pagination.reset();
      prevFiltersRef.current = filters;
    }
  }, [filters, pagination]);

  const paginatedEvents = filteredEvents.slice(
    pagination.startIndex,
    pagination.endIndex
  );

  const { groupedEvents, formatTime } = useGroupedEvents(paginatedEvents);

  return {
    groupedEvents,
    formatTime,
    pagination,
  };
}

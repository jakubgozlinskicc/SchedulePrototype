import { useEffect, useState } from "react";
import type { Event } from "../../db/scheduleDb";
import { getDefaultDateRange } from "../../events/reloadUtils/dateRange";
import { expandRecurringEvent } from "../../events/reloadUtils/occurenceExpander";
import type { IEventRepository } from "../../events/IEventRepository";

export function useRecurringEventLoader(
  parentId: number | undefined,
  occurenceDate: Date | undefined,
  repository: IEventRepository
) {
  const [event, setEvent] = useState<Event | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!parentId) {
        if (!cancelled) {
          setEvent(undefined);
          setIsLoading(false);
        }
        return;
      }

      const parentEvent = await repository.getEventById(parentId);
      if (parentEvent) {
        if (!cancelled && parentEvent?.recurrenceRule?.type !== "none") {
          const range = getDefaultDateRange();
          const occurrences = expandRecurringEvent(parentEvent, range);

          const occurence = occurrences.find(
            (e) => e.start.getTime() === occurenceDate?.getTime()
          );
          setEvent(occurence);
          setIsLoading(false);
        } else if (!cancelled) {
          setEvent(undefined);
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [parentId, occurenceDate, repository]);

  return { event, loading: isLoading };
}

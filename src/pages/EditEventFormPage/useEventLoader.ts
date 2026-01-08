import { useEffect, useState } from "react";
import type { Event } from "../../db/scheduleDb";
import type { IEventRepository } from "../../events/useEvents/IEventRepository";

export function useEventLoader(
  eventId: number | undefined,
  repository: IEventRepository
) {
  const [event, setEvent] = useState<Event | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!eventId) {
        if (!cancelled) {
          setEvent(undefined);
          setIsLoading(false);
        }
        return;
      }

      const event = await repository.getEventById(eventId);

      if (!cancelled) {
        setEvent(event);
        setIsLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [eventId, repository]);

  return { event, loading: isLoading };
}

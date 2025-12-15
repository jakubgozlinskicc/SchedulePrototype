import { useCallback } from "react";
import type { IEventRepository } from "../../IEventRepository";
import { useEventDataContext } from "../../useEventDataContext/useEventDataContext";
import { RecurrenceStrategyRegistry } from "../../../recurrence/strategies/recurrenceStrategyRegistry";
import type { Event } from "../../../../../db/scheduleDb";

export function useReloadEvents(repository: IEventRepository) {
  const { setEvents } = useEventDataContext();

  const reloadEvents = useCallback(async () => {
    try {
      const baseEvents = await repository.getEvents();

      const now = new Date();
      const rangeStart = new Date(now.getFullYear() - 1, 0, 1);
      const rangeEnd = new Date(now.getFullYear() + 2, 11, 31);

      const allEvents: Event[] = [];
      const exceptionsMap = new Map<string, Event>();

      for (const event of baseEvents) {
        if (
          event.isException &&
          event.recurringEventId &&
          event.originalStart
        ) {
          const key = `${
            event.recurringEventId
          }_${event.originalStart.getTime()}`;
          exceptionsMap.set(key, event);
        }
      }

      for (const baseEvent of baseEvents) {
        if (baseEvent.isException) continue;

        if (baseEvent.recurrenceRule?.type !== "none" && baseEvent.id) {
          const cancelledSet = new Set(baseEvent.cancelledDates ?? []);

          const occurrences = RecurrenceStrategyRegistry.generateOccurrences(
            baseEvent,
            rangeStart,
            rangeEnd
          );

          for (const occurrence of occurrences) {
            const occurrenceTime = occurrence.originalStart?.getTime();

            if (occurrenceTime && cancelledSet.has(occurrenceTime)) {
              continue;
            }

            const key = `${baseEvent.id}_${occurrenceTime}`;
            const exception = exceptionsMap.get(key);

            if (exception) {
              allEvents.push(exception);
            } else {
              allEvents.push(occurrence);
            }
          }
        } else {
          allEvents.push(baseEvent);
        }
      }

      setEvents(allEvents);
    } catch (error) {
      console.error("Error during reloading events:", error);
    }
  }, [repository, setEvents]);

  return { reloadEvents };
}

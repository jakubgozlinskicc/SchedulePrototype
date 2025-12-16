import type { Event } from "../../../../../db/scheduleDb";
import type { DateRange, ExceptionsMap } from "./reloadEventTypes";
import { RecurrenceStrategyRegistry } from "../../../recurrence/strategies/recurrenceStrategyRegistry";
import { createExceptionKey } from "./exceptionsMap";

function isCancelled(
  occurrenceTime: number,
  cancelledDates: number[]
): boolean {
  return cancelledDates.includes(occurrenceTime);
}

function resolveOccurrence(
  occurrence: Event,
  parentId: number,
  exceptionsMap: ExceptionsMap
): Event {
  const occurrenceTime = occurrence.originalStart?.getTime();

  if (!occurrenceTime) {
    return occurrence;
  }

  const key = createExceptionKey(parentId, occurrence.originalStart!);
  return exceptionsMap.get(key) ?? occurrence;
}

export function expandRecurringEvent(
  event: Event,
  range: DateRange,
  exceptionsMap: ExceptionsMap
): Event[] {
  const cancelledDates = event.cancelledDates ?? [];

  const occurrences = RecurrenceStrategyRegistry.generateOccurrences(
    event,
    range.start,
    range.end
  );

  const result: Event[] = [];

  for (const occurrence of occurrences) {
    const occurrenceTime = occurrence.originalStart?.getTime();

    if (occurrenceTime && isCancelled(occurrenceTime, cancelledDates)) {
      continue;
    }

    result.push(resolveOccurrence(occurrence, event.id!, exceptionsMap));
  }

  return result;
}

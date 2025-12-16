import type { Event } from "../../../../../db/scheduleDb";
import type { ExceptionsMap } from "./reloadEventTypes";

export function createExceptionKey(
  recurringEventId: number,
  originalStart: Date
): string {
  return `${recurringEventId}_${originalStart.getTime()}`;
}

export function buildExceptionsMap(events: Event[]): ExceptionsMap {
  const map: ExceptionsMap = new Map();

  for (const event of events) {
    if (!event.isException || !event.recurringEventId || !event.originalStart) {
      continue;
    }

    const key = createExceptionKey(event.recurringEventId, event.originalStart);
    map.set(key, event);
  }

  return map;
}

import type { Event } from "../../../../../db/scheduleDb";
import { getDefaultDateRange } from "./dateRange";
import { buildExceptionsMap } from "./exceptionsMap";
import { expandRecurringEvent } from "./occurenceExpander";

function isRecurringEvent(event: Event): boolean {
  return event.recurrenceRule?.type !== "none" && !!event.id;
}

export function expandAllEvents(baseEvents: Event[]): Event[] {
  const range = getDefaultDateRange();
  const exceptionsMap = buildExceptionsMap(baseEvents);
  const result: Event[] = [];

  for (const event of baseEvents) {
    if (event.isException) {
      continue;
    }

    if (isRecurringEvent(event)) {
      result.push(...expandRecurringEvent(event, range, exceptionsMap));
    } else {
      result.push(event);
    }
  }

  return result;
}

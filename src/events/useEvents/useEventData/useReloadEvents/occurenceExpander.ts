import type { Event } from "../../../../db/scheduleDb";
import { RecurrenceStrategyRegistry } from "../../../recurrence/strategies/recurrenceStrategyRegistry";
import type { DateRange } from "./reloadEventTypes";

export function expandRecurringEvent(event: Event, range: DateRange): Event[] {
  const cancelledDates = event.cancelledDates ?? [];

  const occurrences = RecurrenceStrategyRegistry.generateOccurrences(
    event,
    range.start,
    range.end
  );
  return occurrences.filter((occurrence) => {
    const occurrenceTime = occurrence.originalStart?.getTime();
    return !occurrenceTime || !cancelledDates.includes(occurrenceTime);
  });
}

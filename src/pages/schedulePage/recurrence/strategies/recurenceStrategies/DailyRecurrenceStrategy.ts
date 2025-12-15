import type { IRecurrenceStrategy } from "../../recurrenceTypes";
import type { Event, RecurrenceRule } from "../../../../../db/scheduleDb";

export class DailyRecurrenceStrategy implements IRecurrenceStrategy {
  canSupport(type: string): boolean {
    return type === "daily";
  }

  generateOccurrences(
    baseEvent: Event,
    rule: RecurrenceRule,
    rangeStart: Date,
    rangeEnd: Date
  ): Event[] {
    const occurrences: Event[] = [];
    const eventDuration = baseEvent.end.getTime() - baseEvent.start.getTime();

    const currentDate = new Date(baseEvent.start);
    let count = 0;
    const maxOccurrences = rule.count ?? 365;

    while (currentDate <= rangeEnd && count < maxOccurrences) {
      if (rule.endDate && currentDate > rule.endDate) break;

      if (currentDate >= rangeStart) {
        const occurrenceStart = new Date(currentDate);
        const occurrenceEnd = new Date(currentDate.getTime() + eventDuration);

        occurrences.push({
          ...baseEvent,
          id: undefined,
          start: occurrenceStart,
          end: occurrenceEnd,
          recurringEventId: baseEvent.id,
          originalStart: occurrenceStart,
        });
      }

      currentDate.setDate(currentDate.getDate() + rule.interval);
      count++;
    }

    return occurrences;
  }
}

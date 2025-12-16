import type { IRecurrenceStrategy } from "../../recurrenceTypes";
import type { Event } from "../../../../../db/scheduleDb";
import type { RecurrenceRule } from "../../recurrenceTypes";

export abstract class BaseRecurrenceStrategy implements IRecurrenceStrategy {
  abstract canSupport(type: string): boolean;
  protected abstract advanceDate(date: Date, interval: number): void;
  protected getDefaultMaxOccurrences(): number {
    return 100;
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
    const originalStartTime = baseEvent.start.getTime();

    let count = 0;
    const maxOccurrences = rule.count ?? this.getDefaultMaxOccurrences();

    while (currentDate <= rangeEnd && count < maxOccurrences) {
      if (rule.endDate && currentDate > rule.endDate) break;

      if (currentDate >= rangeStart) {
        const isFirstOccurrence = currentDate.getTime() === originalStartTime;
        occurrences.push(
          this.createOccurrence(
            baseEvent,
            currentDate,
            eventDuration,
            isFirstOccurrence
          )
        );
      }
      this.advanceDate(currentDate, rule.interval);
      count++;
    }

    return occurrences;
  }

  private createOccurrence(
    baseEvent: Event,
    date: Date,
    duration: number,
    isFirstOccurrence: boolean
  ): Event {
    const occurrenceStart = new Date(date);
    const occurrenceEnd = new Date(date.getTime() + duration);

    if (isFirstOccurrence) {
      return {
        ...baseEvent,
        start: occurrenceStart,
        end: occurrenceEnd,
      };
    }

    return {
      ...baseEvent,
      id: undefined,
      start: occurrenceStart,
      end: occurrenceEnd,
      recurringEventId: baseEvent.id,
      originalStart: occurrenceStart,
    };
  }
}

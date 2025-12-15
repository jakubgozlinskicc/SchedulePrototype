import type { Event, RecurrenceRule } from "../../../db/scheduleDb";

export interface IRecurrenceStrategy {
  canSupport: (type: string) => boolean;
  generateOccurrences: (
    baseEvent: Event,
    rule: RecurrenceRule,
    rangeStart: Date,
    rangeEnd: Date
  ) => Event[];
}

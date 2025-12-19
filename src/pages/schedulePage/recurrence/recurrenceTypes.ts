import type { Event } from "../../../db/scheduleDb";

export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "yearly";

export interface RecurrenceRule {
  type: RecurrenceType;
  interval: number;
  endDate?: Date;
  count?: number;
}

export interface IRecurrenceStrategy {
  canSupport: (type: string) => boolean;
  generateOccurrences: (
    baseEvent: Event,
    rule: RecurrenceRule,
    rangeStart: Date,
    rangeEnd: Date
  ) => Event[];
}

import type { Event } from "../../../../../db/scheduleDb";

export interface DateRange {
  start: Date;
  end: Date;
}

export type ExceptionsMap = Map<string, Event>;

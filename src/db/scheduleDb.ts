import Dexie from "dexie";
import type { Table } from "dexie";

export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "yearly";

export interface RecurrenceRule {
  type: RecurrenceType;
  interval: number;
  endDate?: Date;
  count?: number;
}

export interface Event {
  id?: number;
  title: string;
  description: string;
  start: Date;
  end: Date;
  color: string;

  recurrenceRule?: RecurrenceRule;
  recurringEventId?: number;
  originalStart?: Date;
  isException?: boolean;
  cancelledDates?: number[];
}

export class EventsDB extends Dexie {
  events!: Table<Event, number>;

  constructor() {
    super("EventsDB");

    this.version(2).stores({
      events:
        "++id, title, description, start, end, color, recurringEventId, originalStart, cancelledDates",
    });

    this.version(1).stores({
      events: "++id, title, description, start, end, color",
    });
  }
}

export const db = new EventsDB();

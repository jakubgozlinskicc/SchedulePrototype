import Dexie from "dexie";
import type { Table } from "dexie";

export interface Event {
  id?: number;
  title: string;
  description: string;
  start: Date;
  end: Date;
  color: string;
}

export class EventsDB extends Dexie {
  events!: Table<Event, number>;

  constructor() {
    super("EventsDB");

    this.version(1).stores({
      // ++id = auto-increment
      events: "++id, title, description, start, end, color",
    });
  }
}

export const db = new EventsDB();

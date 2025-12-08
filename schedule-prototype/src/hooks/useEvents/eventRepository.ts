import type { Event } from "../../db/scheduleDb";

export interface EventRepository {
  addEvent(event: Omit<Event, "id">): Promise<number>;
  getEvents(): Promise<Event[]>;
  editEvent(id: number, changes: Partial<Event>): Promise<void>;
  deleteEvent(id: number): Promise<void>;
  clearEvents(): Promise<void>;
}

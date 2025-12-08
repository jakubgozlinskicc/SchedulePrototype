import { db } from "./scheduleDb";
import type { Event } from "./scheduleDb";
import type { IEventRepository } from "../hooks/useEvents/IEventRepository";

export const dexieEventRepository: IEventRepository = {
  async addEvent(event: Omit<Event, "id">): Promise<number> {
    const id = await db.events.add(event);
    return id;
  },

  async getEvents(): Promise<Event[]> {
    return await db.events.orderBy("id").reverse().toArray();
  },

  async editEvent(id: number, changes: Partial<Event>): Promise<void> {
    await db.events.update(id, changes);
  },

  async deleteEvent(id: number): Promise<void> {
    await db.events.delete(id);
  },

  async clearEvents(): Promise<void> {
    await db.events.clear();
  },
};

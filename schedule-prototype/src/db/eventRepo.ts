import { db } from "./scheduleDb";
import type { Event } from "./scheduleDb";

export async function addEvent(event: Omit<Event, "id">): Promise<number> {
  const id = await db.events.add(event);

  return id;
}

export async function getEvents(): Promise<Event[]> {
  return await db.events.orderBy("id").reverse().toArray();
}

export async function editEvent(
  id: number,
  changes: Partial<Event>
): Promise<void> {
  await db.events.update(id, changes);
}

export async function deleteEvent(id: number): Promise<void> {
  await db.events.delete(id);
}

export async function clearEvents(): Promise<void> {
  await db.events.clear();
}

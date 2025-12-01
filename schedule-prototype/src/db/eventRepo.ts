import { db } from "./scheduleDb";
import type { Event } from "./scheduleDb";

export async function addEvent(
  title: string,
  description: string,
  start: Date,
  end: Date,
  color: string
) {
  const id = await db.events.add({
    title,
    description,
    start,
    end,
    color,
  });
  return { id, title, description, start, end, color };
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

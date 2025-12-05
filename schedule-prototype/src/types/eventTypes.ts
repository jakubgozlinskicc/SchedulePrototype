import type { Event } from "../db/scheduleDb";

export type EventData = Omit<Event, "id">;
export type PartialEventData = Partial<EventData>;

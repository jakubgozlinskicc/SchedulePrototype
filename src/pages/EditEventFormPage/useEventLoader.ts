import { use } from "react";
import type { Event } from "../../db/scheduleDb";
import { eventRepository } from "../../db/eventRepository";

const eventPromiseCache = new Map<number, Promise<Event | undefined>>();

function getEventPromise(eventId: number): Promise<Event | undefined> {
  const cached = eventPromiseCache.get(eventId);
  if (cached) {
    return cached;
  }

  const promise = eventRepository.getEventById(eventId);
  eventPromiseCache.set(eventId, promise);
  return promise;
}

export function useEventLoader(eventId: number | undefined) {
  if (eventId === undefined) {
    return { event: undefined };
  }

  const event = use(getEventPromise(eventId));
  return { event };
}

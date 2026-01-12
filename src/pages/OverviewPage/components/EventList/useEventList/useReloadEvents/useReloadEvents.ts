import { useState } from "react";
import type { IEventRepository } from "../../../../../../events/useEvents/IEventRepository";
import { expandAllEvents } from "../../../../../../events/useEvents/useEventData/useReloadEvents/eventExpander";
import type { Event } from "../../../../../../db/scheduleDb";

export function useReloadEvents(repository: IEventRepository) {
  const [events, setEvents] = useState<Event[]>([]);

  const reloadEvents = async () => {
    try {
      const baseEvents = await repository.getEvents();
      const expandedEvents = expandAllEvents(baseEvents);
      setEvents(expandedEvents);
    } catch (error) {
      console.error("Error during reloading events:", error);
    }
  };

  return { events, reloadEvents };
}

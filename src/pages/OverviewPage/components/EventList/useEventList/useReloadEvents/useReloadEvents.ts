import { useState } from "react";
import { expandAllEvents } from "../../../../../../events/reloadUtils/eventExpander";
import type { Event } from "../../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../../../../events/IEventRepository";

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

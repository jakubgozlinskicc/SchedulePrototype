import { useCallback } from "react";
import type { IEventRepository } from "../../IEventRepository";
import { useEventDataContext } from "../../useEventDataContext/useEventDataContext";
import { expandAllEvents } from "./eventExpander";

export function useReloadEvents(repository: IEventRepository) {
  const { setEvents } = useEventDataContext();

  const reloadEvents = useCallback(async () => {
    try {
      const baseEvents = await repository.getEvents();
      const expandedEvents = expandAllEvents(baseEvents);
      setEvents(expandedEvents);
    } catch (error) {
      console.error("Error during reloading events:", error);
    }
  }, [repository, setEvents]);

  return { reloadEvents };
}

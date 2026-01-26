import type { IEventRepository } from "../../../../../events/IEventRepository";
import { useEventDataContext } from "../../useEventDataContext/useEventDataContext";
import { expandAllEvents } from "../../../../../events/reloadUtils/eventExpander";

export function useReloadEvents(repository: IEventRepository) {
  const { setEvents } = useEventDataContext();

  const reloadEvents = async () => {
    try {
      const baseEvents = await repository.getEvents();
      const expandedEvents = expandAllEvents(baseEvents);
      setEvents(expandedEvents);
    } catch (error) {
      console.error("Error during reloading events:", error);
    }
  };

  return { reloadEvents };
}

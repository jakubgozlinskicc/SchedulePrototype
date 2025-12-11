import { useCallback } from "react";
import type { IEventRepository } from "../../IEventRepository";
import { useEventDataContext } from "../../useEventDataContext/useEventDataContext";

export function useReloadEvents(repository: IEventRepository) {
  const { setEvents } = useEventDataContext();

  const reloadEvents = useCallback(async () => {
    try {
      const items = await repository.getEvents();
      setEvents(items);
    } catch (error) {
      console.error("Error during reloading events:", error);
    }
  }, [repository, setEvents]);

  return { reloadEvents };
}

import { useEffect } from "react";
import { useReloadEvents } from "../useReloadEvents/useReloadEvents";
import type { IEventRepository } from "../../../../../../events/IEventRepository";

export function useLoadEvents(repository: IEventRepository) {
  const { events, reloadEvents } = useReloadEvents(repository);

  useEffect(() => {
    const load = async () => {
      try {
        await reloadEvents();
      } catch (error) {
        console.error("Error during loading events:", error);
      }
    };
    void load();
  }, [reloadEvents]);

  return { events, reloadEvents };
}

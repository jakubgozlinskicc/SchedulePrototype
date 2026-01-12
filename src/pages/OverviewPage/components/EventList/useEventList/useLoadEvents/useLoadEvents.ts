import { useEffect } from "react";
import type { IEventRepository } from "../../../../../../events/useEvents/IEventRepository";
import { useReloadEvents } from "../useReloadEvents/useReloadEvents";

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

  return { events };
}

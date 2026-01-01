import { useEffect } from "react";
import { useReloadEvents } from "../useReloadEvents/useReloadEvents";
import type { IEventRepository } from "../../IEventRepository";

export function useLoadEvents(repository: IEventRepository) {
  const { reloadEvents } = useReloadEvents(repository);

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
}

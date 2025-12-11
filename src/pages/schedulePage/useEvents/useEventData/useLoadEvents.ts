import { useEffect } from "react";
import type { IEventRepository } from "../IEventRepository";
import { useReloadEvents } from "./useReloadEvents";

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

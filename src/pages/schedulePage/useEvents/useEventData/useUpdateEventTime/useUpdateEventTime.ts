import { useCallback } from "react";
import type { IEventRepository } from "../../IEventRepository";
import { useReloadEvents } from "../useReloadEvents/useReloadEvents";

export function useUpdateEventTime(repository: IEventRepository) {
  const { reloadEvents } = useReloadEvents(repository);

  const updateEventTime = useCallback(
    async (id: number, start: Date, end: Date) => {
      try {
        await repository.editEvent(id, { start, end });
        await reloadEvents();
      } catch (error) {
        console.error("Error during event time change:", error);
      }
    },
    [repository, reloadEvents]
  );

  return { updateEventTime };
}

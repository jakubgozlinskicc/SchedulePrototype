import { useCallback } from "react";
import type { IEventRepository } from "../../IEventRepository";
import { useEventDataContext } from "../../useEventDataContext/useEventDataContext";
import { useReloadEvents } from "../useReloadEvents/useReloadEvents";
import { DeleteStrategyRegistry } from "./deleteStrategies/deleteStrategyRegistry";

export function useDeleteEvent(
  closeModal: () => void,
  repository: IEventRepository
) {
  const { eventData, isDeleteAll } = useEventDataContext();
  const { reloadEvents } = useReloadEvents(repository);

  const deleteCurrentEvent = useCallback(async () => {
    try {
      await DeleteStrategyRegistry.executeDelete(eventData, repository, {
        isDeleteAll,
      });
      await reloadEvents();
      closeModal();
    } catch (error) {
      console.error("Error during deleting event:", error);
    }
  }, [eventData, repository, isDeleteAll, reloadEvents, closeModal]);

  return { deleteCurrentEvent };
}

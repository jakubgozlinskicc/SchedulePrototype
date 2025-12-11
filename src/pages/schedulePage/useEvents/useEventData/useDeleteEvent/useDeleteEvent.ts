import { useCallback } from "react";
import type { IEventRepository } from "../../IEventRepository";
import { useEventDataContext } from "../../useEventDataContext/useEventDataContext";
import { useReloadEvents } from "../useReloadEvents/useReloadEvents";

export function useDeleteEvent(
  closeModal: () => void,
  repository: IEventRepository
) {
  const { eventData } = useEventDataContext();
  const { reloadEvents } = useReloadEvents(repository);

  const deleteCurrentEvent = useCallback(async () => {
    if (!eventData.id) return;

    try {
      await repository.deleteEvent(eventData.id);
      await reloadEvents();
      closeModal();
    } catch (error) {
      console.error("Error during deleting event:", error);
    }
  }, [eventData.id, repository, reloadEvents, closeModal]);

  return { deleteCurrentEvent };
}

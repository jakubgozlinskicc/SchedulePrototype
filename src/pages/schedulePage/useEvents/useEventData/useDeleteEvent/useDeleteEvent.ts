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
    try {
      if (eventData.recurringEventId && !eventData.id) {
        const allEvents = await repository.getEvents();
        const parentEvent = allEvents.find(
          (e) => e.id === eventData.recurringEventId
        );

        if (parentEvent) {
          const cancelledDates = parentEvent.cancelledDates ?? [];
          const dateToCancel = eventData.originalStart ?? eventData.start;
          cancelledDates.push(dateToCancel.getTime());

          await repository.editEvent(parentEvent.id!, { cancelledDates });
        }
      } else if (eventData.id) {
        await repository.deleteEvent(eventData.id);
      }

      await reloadEvents();
      closeModal();
    } catch (error) {
      console.error("Error during deleting event:", error);
    }
  }, [eventData, repository, reloadEvents, closeModal]);

  return { deleteCurrentEvent };
}

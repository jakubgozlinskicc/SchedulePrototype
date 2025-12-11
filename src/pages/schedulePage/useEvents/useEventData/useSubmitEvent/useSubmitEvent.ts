import { useCallback, type FormEvent } from "react";
import type { IEventRepository } from "../../IEventRepository";
import { useEventDataContext } from "../../useEventDataContext/useEventDataContext";
import { useReloadEvents } from "../useReloadEvents/useReloadEvents";

export function useSubmitEvent(
  closeModal: () => void,
  repository: IEventRepository
) {
  const { eventData } = useEventDataContext();
  const { reloadEvents } = useReloadEvents(repository);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      try {
        if (eventData.id) {
          await repository.editEvent(eventData.id, eventData);
        } else {
          await repository.addEvent(eventData);
        }

        await reloadEvents();
        closeModal();
      } catch (error) {
        console.error("Error during saving events:", error);
      }
    },
    [eventData, repository, reloadEvents, closeModal]
  );

  return { handleSubmit };
}

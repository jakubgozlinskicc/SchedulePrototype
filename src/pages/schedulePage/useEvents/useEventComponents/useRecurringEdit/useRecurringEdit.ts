import { useCallback } from "react";
import { useEventDataContext } from "../../useEventDataContext/useEventDataContext";
import type { IEventRepository } from "../../IEventRepository";

export function useRecurringEdit(repository: IEventRepository) {
  const { eventData, setEventData, setIsDeleteAll } = useEventDataContext();

  const handleEditSingle = useCallback(() => {
    setIsDeleteAll(false);
    setEventData((prev) => ({
      ...prev,
    }));
  }, [setEventData, setIsDeleteAll]);

  const handleEditAll = useCallback(async () => {
    setIsDeleteAll(true);

    if (!eventData.recurringEventId) return;

    try {
      const parentEvent = await repository.getEventById(
        eventData.recurringEventId
      );

      if (parentEvent) {
        setEventData(parentEvent);
      }
    } catch (error) {
      console.error("Error loading parent event:", error);
    }
  }, [eventData.recurringEventId, repository, setEventData, setIsDeleteAll]);

  return {
    handleEditSingle,
    handleEditAll,
  };
}

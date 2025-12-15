import { useCallback } from "react";
import { useEventDataContext } from "../../useEventDataContext/useEventDataContext";
import type { IEventRepository } from "../../IEventRepository";

export function useRecurringEdit(repository: IEventRepository) {
  const { eventData, setEventData } = useEventDataContext();

  const handleEditSingle = useCallback(() => {
    setEventData((prev) => ({
      ...prev,
      id: undefined,
      isException: true,
      recurrenceRule: { type: "none", interval: 1 },
    }));
  }, [setEventData]);

  const handleEditAll = useCallback(async () => {
    if (!eventData.recurringEventId) return;

    try {
      const allEvents = await repository.getEvents();
      const parentEvent = allEvents.find(
        (e) => e.id === eventData.recurringEventId
      );

      if (parentEvent) {
        setEventData(parentEvent);
      }
    } catch (error) {
      console.error("Error loading parent event:", error);
    }
  }, [eventData.recurringEventId, repository, setEventData]);

  return {
    handleEditSingle,
    handleEditAll,
  };
}

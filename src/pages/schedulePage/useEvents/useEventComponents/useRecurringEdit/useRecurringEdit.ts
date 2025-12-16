import { useCallback } from "react";
import { useEventDataContext } from "../../useEventDataContext/useEventDataContext";
import type { IEventRepository } from "../../IEventRepository";

export function useRecurringEdit(repository: IEventRepository) {
  const { eventData, setEventData } = useEventDataContext();

  const handleEditSingle = useCallback(async () => {
    try {
      setEventData((prev) => ({
        ...prev,
        recurrenceRule: { type: "none", interval: 1 },
      }));
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
    } catch (error) {
      console.error("Error loading parent event:", error);
    }
  }, [
    repository,
    setEventData,
    eventData.recurringEventId,
    eventData.originalStart,
    eventData.start,
  ]);

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

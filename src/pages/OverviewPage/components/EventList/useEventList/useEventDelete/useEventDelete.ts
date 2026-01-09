import { useState } from "react";
import type { Event } from "../../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../../../../events/useEvents/IEventRepository";
import { useReloadEvents } from "../../../../../../events/useEvents/useEventData/useReloadEvents/useReloadEvents";
import { DeleteStrategyRegistry } from "../../../../../../events/useEvents/useEventData/useDeleteEvent/deleteStrategies/deleteStrategyRegistry";

export function useEventDelete(eventRepository: IEventRepository) {
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const { reloadEvents } = useReloadEvents(eventRepository);

  const isRecurringEvent = (event: Event) => {
    return (!!event.id && event.recurrenceRule?.type !== "none") || !event.id;
  };

  const handleDeleteClick = (event: Event) => {
    if (isRecurringEvent(event)) {
      setEventToDelete(event);
    } else {
      handleDeleteSingle(event);
    }
  };

  const handleDeleteSingle = async (event: Event, isEditAll = false) => {
    try {
      await DeleteStrategyRegistry.executeDelete(event, eventRepository, {
        isEditAll,
      });
      await reloadEvents();
      setEventToDelete(null);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleDeleteAll = async () => {
    if (!eventToDelete) return;
    await handleDeleteSingle(eventToDelete, true);
  };

  const handleCancelDelete = () => {
    setEventToDelete(null);
  };

  return {
    eventToDelete,
    isRecurringEvent,
    handleDeleteClick,
    handleDeleteSingle: () =>
      eventToDelete && handleDeleteSingle(eventToDelete, false),
    handleDeleteAll,
    handleCancelDelete,
  };
}

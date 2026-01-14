import { useState } from "react";
import type { Event } from "../../../../../../db/scheduleDb";
import { DeleteStrategyRegistry } from "../../../../../../events/deleteStrategies/deleteStrategyRegistry";
import type { IEventRepository } from "../../../../../../events/IEventRepository";
import { useDeleteConfirmation } from "../../../../../../hooks/useDeleteConfirmation/useDeleteConfirmation";

export function useEventDelete(
  eventRepository: IEventRepository,
  reloadEvents: () => Promise<void>
) {
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const { isDeleteModalOpen, closeDeleteModal, openDeleteModal } =
    useDeleteConfirmation();

  const isRecurringEvent = (event: Event) => {
    return (!!event.id && event.recurrenceRule?.type !== "none") || !event.id;
  };

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    if (!isRecurringEvent(event)) {
      openDeleteModal();
    }
  };

  const handleDeleteSingle = async (event: Event, isDeleteAll = false) => {
    try {
      await DeleteStrategyRegistry.executeDelete(event, eventRepository, {
        isDeleteAll,
      });
      await reloadEvents();
      setEventToDelete(null);
      closeDeleteModal();
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
    isDeleteModalOpen,
    isRecurringEvent,
    handleDeleteClick,
    handleDeleteSingle: () =>
      eventToDelete && handleDeleteSingle(eventToDelete, false),
    handleDeleteAll,
    handleCancelDelete,
    closeDeleteModal,
  };
}

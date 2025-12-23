import { eventRepository } from "../../../../../../db/eventRepository";
import { useReloadEvents } from "../../../../../../events/useEvents/useEventData/useReloadEvents/useReloadEvents";
import { DeleteStrategyRegistry } from "../../../../../../events/useEvents/useEventData/useDeleteEvent/deleteStrategies/deleteStrategyRegistry";

interface UseEventFormDeleteProps {
  eventId?: number;
  onSuccess: () => void;
}

export function useEventFormDelete({
  eventId,
  onSuccess,
}: UseEventFormDeleteProps) {
  const { reloadEvents } = useReloadEvents(eventRepository);

  const handleDelete = async () => {
    if (!eventId) return;

    try {
      const event = await eventRepository.getEventById(eventId);
      if (!event) return;

      await DeleteStrategyRegistry.executeDelete(event, eventRepository, {
        isDeleteAll: false,
      });
      await reloadEvents();
      onSuccess();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return { handleDelete };
}

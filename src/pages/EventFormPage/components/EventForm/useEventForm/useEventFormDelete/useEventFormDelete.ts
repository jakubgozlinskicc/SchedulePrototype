import type { IEventRepository } from "../../../../../../events/useEvents/IEventRepository";
import { useReloadEvents } from "../../../../../../events/useEvents/useEventData/useReloadEvents/useReloadEvents";
import { useEventDataContext } from "../../../../../../events/useEvents/useEventDataContext/useEventDataContext";
import { useEventFormNavigation } from "../useEventFormNavigation/useEventFormNavigation";
import { DeleteStrategyRegistry } from "../../../../../../events/useEvents/useEventData/useDeleteEvent/deleteStrategies/deleteStrategyRegistry";
import { getDefaultEvent } from "../../../../../../utils/getDefaultEvent/getDefaultEvent";

export function useEventFormDelete(eventRepository: IEventRepository) {
  const { eventData, setEventData } = useEventDataContext();
  const { reloadEvents } = useReloadEvents(eventRepository);
  const { goToOverview } = useEventFormNavigation();

  const handleDelete = async () => {
    if (!eventData?.id) return;

    try {
      await DeleteStrategyRegistry.executeDelete(eventData, eventRepository, {
        isEditAll: false,
      });
      await reloadEvents();
      setEventData(getDefaultEvent());
      goToOverview();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return { handleDelete };
}

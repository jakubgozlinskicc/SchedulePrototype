import type { IEventRepository } from "../../../../useEvents/IEventRepository";
import type { Event } from "../../../../../db/scheduleDb";
import { useReloadEvents } from "../../../../useEvents/useEventData/useReloadEvents/useReloadEvents";
import { useEventFormNavigation } from "../useEventFormNavigation/useEventFormNavigation";
import { DeleteStrategyRegistry } from "../../../../useEvents/useEventData/useDeleteEvent/deleteStrategies/deleteStrategyRegistry";

interface UseEventFormDeleteOptions {
  event?: Event;
  isEditAll?: boolean;
}

export function useEventFormDelete(
  eventRepository: IEventRepository,
  options: UseEventFormDeleteOptions = {}
) {
  const { reloadEvents } = useReloadEvents(eventRepository);
  const { goToOverview } = useEventFormNavigation();
  const { event, isEditAll = false } = options;

  const handleDelete = async () => {
    if (!event) return;

    try {
      await DeleteStrategyRegistry.executeDelete(event, eventRepository, {
        isEditAll,
      });
      await reloadEvents();
      goToOverview();
    } catch (error) {
      console.error(error);
    }
  };

  return { handleDelete };
}

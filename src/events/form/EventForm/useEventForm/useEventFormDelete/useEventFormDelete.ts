import type { IEventRepository } from "../../../../useEvents/IEventRepository";
import type { Event } from "../../../../../db/scheduleDb";
import { useReloadEvents } from "../../../../useEvents/useEventData/useReloadEvents/useReloadEvents";
import { useEventFormNavigation } from "../useEventFormNavigation/useEventFormNavigation";
import { DeleteStrategyRegistry } from "../../../../useEvents/useEventData/useDeleteEvent/deleteStrategies/deleteStrategyRegistry";

export function useEventFormDelete(
  eventRepository: IEventRepository,
  event?: Event
) {
  const { reloadEvents } = useReloadEvents(eventRepository);
  const { goToOverview } = useEventFormNavigation();

  const handleDelete = async (isEditAll?: boolean) => {
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

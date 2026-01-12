import type { IEventRepository } from "../../../../useEvents/IEventRepository";
import type { Event } from "../../../../../db/scheduleDb";
import { useEventFormNavigation } from "../useEventFormNavigation/useEventFormNavigation";
import { DeleteStrategyRegistry } from "../../../../useEvents/useEventData/useDeleteEvent/deleteStrategies/deleteStrategyRegistry";
import { useReloadEvents } from "../../../../../pages/OverviewPage/components/EventList/useEventList/useReloadEvents/useReloadEvents";

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

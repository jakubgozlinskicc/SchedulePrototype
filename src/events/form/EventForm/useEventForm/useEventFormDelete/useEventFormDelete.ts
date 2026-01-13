import type { Event } from "../../../../../db/scheduleDb";
import { useEventFormNavigation } from "../useEventFormNavigation/useEventFormNavigation";
import { DeleteStrategyRegistry } from "../../../../deleteStrategies/deleteStrategyRegistry";
import { useReloadEvents } from "../../../../../pages/OverviewPage/components/EventList/useEventList/useReloadEvents/useReloadEvents";
import type { IEventRepository } from "../../../../IEventRepository";

export function useEventFormDelete(
  eventRepository: IEventRepository,
  event?: Event
) {
  const { reloadEvents } = useReloadEvents(eventRepository);
  const { goToOverview } = useEventFormNavigation();

  const handleDelete = async (isDeleteAll?: boolean) => {
    if (!event) return;

    try {
      await DeleteStrategyRegistry.executeDelete(event, eventRepository, {
        isDeleteAll,
      });
      await reloadEvents();
      goToOverview();
    } catch (error) {
      console.error(error);
    }
  };

  return { handleDelete };
}

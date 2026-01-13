import type { Event } from "../../../../../db/scheduleDb";
import { SubmitStrategyRegistry } from "../../../../submitStrategies/SubmitStrategyRegistry";
import { useEventFormNavigation } from "../useEventFormNavigation/useEventFormNavigation";
import type { EventFormData } from "../../eventFormSchema";
import { convertFormDataToEvent } from "../convertFormDataToEvent";
import { useReloadEvents } from "../../../../../pages/OverviewPage/components/EventList/useEventList/useReloadEvents/useReloadEvents";
import type { IEventRepository } from "../../../../IEventRepository";

export function useEventFormSubmit(
  eventRepository: IEventRepository,
  event?: Event
) {
  const { reloadEvents } = useReloadEvents(eventRepository);
  const { goToOverview } = useEventFormNavigation();

  const onSubmit = async (
    data: EventFormData,
    currentIsEditAll: boolean = false
  ) => {
    try {
      const eventToSave = convertFormDataToEvent(data, event);

      await SubmitStrategyRegistry.executeSubmit(eventToSave, eventRepository, {
        isEditAll: currentIsEditAll,
      });
      await reloadEvents();
      goToOverview();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return { onSubmit };
}

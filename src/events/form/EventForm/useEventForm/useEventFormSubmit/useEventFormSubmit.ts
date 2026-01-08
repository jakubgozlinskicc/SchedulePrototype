import type { IEventRepository } from "../../../../useEvents/IEventRepository";
import type { Event } from "../../../../../db/scheduleDb";
import { SubmitStrategyRegistry } from "../../../../useEvents/useEventData/useSubmitEvent/submitStrategies/SubmitStrategyRegistry";
import { useReloadEvents } from "../../../../useEvents/useEventData/useReloadEvents/useReloadEvents";
import { useEventFormNavigation } from "../useEventFormNavigation/useEventFormNavigation";
import type { EventFormData } from "../../eventFormSchema";
import { convertFormDataToEvent } from "../convertFormDataToEvent";

interface UseEventFormSubmitOptions {
  event?: Event;
}

export function useEventFormSubmit(
  eventRepository: IEventRepository,
  options: UseEventFormSubmitOptions = {}
) {
  const { reloadEvents } = useReloadEvents(eventRepository);
  const { goToOverview } = useEventFormNavigation();
  const { event } = options;

  const onSubmit = async (
    data: EventFormData,
    currentIsEditAll: boolean = false
  ) => {
    try {
      console.log("event:", data);
      console.log("formularz:", data);
      const eventToSave = convertFormDataToEvent(data, event);
      console.log("event to save:", eventToSave);
      console.log("czy edit all:", currentIsEditAll);
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

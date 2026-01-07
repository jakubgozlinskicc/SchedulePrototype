import type { IEventRepository } from "../../../../useEvents/IEventRepository";
import type { Event } from "../../../../../db/scheduleDb";
import { SubmitStrategyRegistry } from "../../../../useEvents/useEventData/useSubmitEvent/submitStrategies/SubmitStrategyRegistry";
import { useReloadEvents } from "../../../../useEvents/useEventData/useReloadEvents/useReloadEvents";
import { useEventFormNavigation } from "../useEventFormNavigation/useEventFormNavigation";
import type { EventFormData } from "../../eventFormSchema";
import { convertFormDataToEvent } from "../convertFormDataToEvent";

interface UseEventFormSubmitOptions {
  event?: Event;
  isEditAll?: boolean;
}

export function useEventFormSubmit(
  eventRepository: IEventRepository,
  options: UseEventFormSubmitOptions = {}
) {
  const { reloadEvents } = useReloadEvents(eventRepository);
  const { goToOverview } = useEventFormNavigation();
  const { event, isEditAll = false } = options;

  const onSubmit = async (data: EventFormData) => {
    try {
      const eventToSave = convertFormDataToEvent(data, event);
      await SubmitStrategyRegistry.executeSubmit(eventToSave, eventRepository, {
        isEditAll,
      });
      await reloadEvents();
      goToOverview();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return { onSubmit };
}

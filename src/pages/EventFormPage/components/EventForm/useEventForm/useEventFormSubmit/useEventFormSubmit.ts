import type { IEventRepository } from "../../../../../../events/useEvents/IEventRepository";
import { SubmitStrategyRegistry } from "../../../../../../events/useEvents/useEventData/useSubmitEvent/submitStrategies/SubmitStrategyRegistry";
import { useReloadEvents } from "../../../../../../events/useEvents/useEventData/useReloadEvents/useReloadEvents";
import { useEventFormNavigation } from "../useEventFormNavigation/useEventFormNavigation";
import type { EventFormData } from "../../eventFormSchema";
import { convertFormDataToEvent } from "../convertFormDataToEvent";
import { useEventDataContext } from "../../../../../../events/useEvents/useEventDataContext/useEventDataContext";
import { getDefaultEvent } from "../../../../../../utils/getDefaultEvent/getDefaultEvent";

export function useEventFormSubmit(eventRepository: IEventRepository) {
  const { reloadEvents } = useReloadEvents(eventRepository);
  const { goToOverview } = useEventFormNavigation();
  const { eventData, setEventData, isEditAll, setIsEditAll } =
    useEventDataContext();

  const onSubmit = async (data: EventFormData) => {
    try {
      const event = convertFormDataToEvent(data, eventData);
      await SubmitStrategyRegistry.executeSubmit(event, eventRepository, {
        isEditAll,
      });
      console.log(event);
      await reloadEvents();
      setIsEditAll(false);
      setEventData(getDefaultEvent);
      goToOverview();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return { onSubmit };
}

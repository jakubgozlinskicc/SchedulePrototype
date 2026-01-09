import type { IEventRepository } from "../../IEventRepository";
import type { Event } from "../../../../db/scheduleDb";
import { SubmitStrategyRegistry } from "./submitStrategies/SubmitStrategyRegistry";
import { useReloadEvents } from "../useReloadEvents/useReloadEvents";
import type { EventFormData } from "../../../../events/form/EventForm/eventFormSchema";
import { convertFormDataToEvent } from "../../../../events/form/EventForm/useEventForm/convertFormDataToEvent";
import { useEventDataContext } from "../../useEventDataContext/useEventDataContext";

export function useSubmitEvent(
  closeModal: () => void,
  repository: IEventRepository,
  event?: Event
) {
  const { reloadEvents } = useReloadEvents(repository);
  const { isEditAll } = useEventDataContext();

  const onSubmit = async (data: EventFormData) => {
    try {
      console.log("data:", data);
      const eventToSave = convertFormDataToEvent(data, event);
      console.log("Event to save:", eventToSave);
      console.log("isEditAll:", isEditAll);

      await SubmitStrategyRegistry.executeSubmit(eventToSave, repository, {
        isEditAll,
      });

      await reloadEvents();
      closeModal();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return { onSubmit };
}

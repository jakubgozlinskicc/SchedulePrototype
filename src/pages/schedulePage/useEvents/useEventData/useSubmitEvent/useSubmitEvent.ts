import type { IEventRepository } from "../../../../../events/IEventRepository";
import type { Event } from "../../../../../db/scheduleDb";
import { SubmitStrategyRegistry } from "../../../../../events/submitStrategies/SubmitStrategyRegistry";
import { useReloadEvents } from "../useReloadEvents/useReloadEvents";
import type { EventFormData } from "../../../../../events/form/EventForm/eventFormSchema";
import { convertFormDataToEvent } from "../../../../../events/form/EventForm/useEventForm/convertFormDataToEvent";
import { useEventDataContext } from "../../useEventDataContext/useEventDataContext";

export function useSubmitEvent(
  closeModal: () => void,
  repository: IEventRepository,
  event?: Event
) {
  const { reloadEvents } = useReloadEvents(repository);
  const { isEditAll, setIsEditAll } = useEventDataContext();

  const onSubmit = async (data: EventFormData) => {
    try {
      const eventToSave = convertFormDataToEvent(data, event);

      await SubmitStrategyRegistry.executeSubmit(eventToSave, repository, {
        isEditAll,
      });
      setIsEditAll(false);

      await reloadEvents();
      closeModal();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return { onSubmit };
}

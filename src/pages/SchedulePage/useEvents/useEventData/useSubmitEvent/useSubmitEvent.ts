import type { IEventRepository } from "../../../../../events/IEventRepository";
import type { Event } from "../../../../../db/scheduleDb";
import { SubmitStrategyRegistry } from "../../../../../events/submitStrategies/submitStrategyRegistry";
import { useReloadEvents } from "../useReloadEvents/useReloadEvents";
import type { EventFormData } from "../../../../../events/form/EventForm/eventFormSchema";
import { convertFormDataToEvent } from "../../../../../events/form/EventForm/useEventForm/convertFormDataToEvent";
import type { EditOptions } from "../../../../../events/submitStrategies/ISubmitStrategy";

export function useSubmitEvent(
  closeModal: () => void,
  repository: IEventRepository,
  event?: Event,
) {
  const { reloadEvents } = useReloadEvents(repository);

  const onSubmit = async (data: EventFormData, options?: EditOptions) => {
    try {
      const eventToSave = convertFormDataToEvent(data, event);
      console.log("Event to save:", data);
      console.log("Submitting event:", eventToSave, options);
      await SubmitStrategyRegistry.executeSubmit(
        eventToSave,
        repository,
        options,
      );

      await reloadEvents();
      closeModal();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return { onSubmit };
}

import { eventRepository } from "../../../../../../db/eventRepository";
import { SubmitStrategyRegistry } from "../../../../../../events/useEvents/useEventData/useSubmitEvent/submitStrategies/SubmitStrategyRegistry";
import { useReloadEvents } from "../../../../../../events/useEvents/useEventData/useReloadEvents/useReloadEvents";
import type { EventFormData } from "../../eventFormSchema";
import type { Event } from "../../../../../../db/scheduleDb";

interface UseEventFormSubmitProps {
  eventId?: number;
  onSuccess: () => void;
}

export function useEventFormSubmit({
  eventId,
  onSuccess,
}: UseEventFormSubmitProps) {
  const { reloadEvents } = useReloadEvents(eventRepository);

  const convertFormDataToEvent = (data: EventFormData): Event => {
    return {
      ...(eventId && { id: eventId }),
      title: data.title,
      description: data.description,
      start: new Date(data.start),
      end: new Date(data.end),
      color: data.color,
    };
  };

  const onSubmit = async (data: EventFormData) => {
    try {
      const event = convertFormDataToEvent(data);
      await SubmitStrategyRegistry.executeSubmit(event, eventRepository);
      await reloadEvents();
      onSuccess();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return { onSubmit };
}

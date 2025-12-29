import type { Event } from "../../../../../db/scheduleDb";
import type { EventFormData } from "../eventFormSchema";

export function convertFormDataToEvent(
  data: EventFormData,
  eventData?: Event
): Event {
  return {
    ...eventData,
    title: data.title,
    description: data.description,
    start: new Date(data.start),
    end: new Date(data.end),
    color: data.color,
  };
}

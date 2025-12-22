import type { EventFormData } from "../eventFormSchema";
import type { Event } from "../../../../../db/scheduleDb";
export const convertFormDataToEvent = (data: EventFormData): Event => {
  return {
    ...(eventId && { id: eventId }),
    title: data.title,
    description: data.description,
    start: new Date(data.start),
    end: new Date(data.end),
    color: data.color,
  };
};

import type { UseFormReset } from "react-hook-form";
import type { EventFormData } from "../../eventFormSchema";
import { toDateTimeLocal } from "../../../../../../utils/toDateTimeLocal/toDateTimeLocal";
import { eventRepository } from "../../../../../../db/eventRepository";
import { useEffect, useState } from "react";

interface UseLoadEventProps {
  eventId?: number;
  reset: UseFormReset<EventFormData>;
}

export function useLoadEvent({ eventId, reset }: UseLoadEventProps) {
  const [isLoading, setIsLoading] = useState(!!eventId);

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) return;

      try {
        const event = await eventRepository.getEventById(eventId);
        if (event) {
          reset({
            title: event.title,
            description: event.description,
            start: toDateTimeLocal(event.start),
            end: toDateTimeLocal(event.end),
            color: event.color,
          });
        }
      } catch (error) {
        console.error("Error loading event:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [eventId, reset]);

  return { isLoading };
}

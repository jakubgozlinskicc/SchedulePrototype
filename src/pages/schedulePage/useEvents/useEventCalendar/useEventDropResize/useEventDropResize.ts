import { useCallback } from "react";
import type { Event } from "../../../../../db/scheduleDb";

type DragDropArgs = {
  event: Event;
  start: Date | string;
  end: Date | string;
  allDay?: boolean;
};

export function useEventDropResize(
  updateEventTime: (id: number, start: Date, end: Date) => Promise<void>
) {
  const handleEventDropResize = useCallback(
    async ({ event, start, end }: DragDropArgs) => {
      if (!event.id) return;

      const startDate = start instanceof Date ? start : new Date(start);
      const endDate = end instanceof Date ? end : new Date(end);
      try {
        await updateEventTime(event.id, startDate, endDate);
      } catch (error) {
        console.error("Error during droping or resizing event:", error);
      }
    },
    [updateEventTime]
  );

  return {
    handleEventDropResize,
  };
}

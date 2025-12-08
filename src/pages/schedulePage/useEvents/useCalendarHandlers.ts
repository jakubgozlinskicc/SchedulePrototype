import { useCallback } from "react";
import type { Event } from "../../../db/scheduleDb";
import type { SlotInfo } from "react-big-calendar";

type DragDropArgs = {
  event: Event;
  start: Date | string;
  end: Date | string;
  allDay?: boolean;
};

export function useCalendarHandlers(
  openModal: (data?: Partial<Event & { id?: number }>) => void,
  updateEventTime: (id: number, start: Date, end: Date) => Promise<void>,
  clearHover: () => void
) {
  const handleSelectSlot = useCallback(
    (slotInfo: SlotInfo) => {
      openModal({
        start: slotInfo.start,
        end: slotInfo.end,
      });
    },
    [openModal]
  );

  const handleSelectEvent = useCallback(
    (event: Event) => {
      if (clearHover) clearHover();
      openModal(event);
    },
    [openModal, clearHover]
  );

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
    handleSelectSlot,
    handleSelectEvent,
    handleEventDropResize,
  };
}

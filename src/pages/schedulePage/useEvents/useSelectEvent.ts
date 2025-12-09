import { useCallback, useState } from "react";
import type { Event } from "../../../db/scheduleDb";
import { getDefaultEvent } from "../../../utils/getDefaultEvent";
import type { SlotInfo } from "react-big-calendar";

export function useSelectEvent(openModal: () => void, clearHover: () => void) {
  const [eventData, setEventData] = useState<Event>(getDefaultEvent());

  const handleSelectEvent = useCallback(
    (event: Event) => {
      if (clearHover) clearHover();
      setEventData(event);
      openModal();
    },
    [openModal, clearHover]
  );

  const handleSelectSlot = useCallback(
    (slotInfo: SlotInfo) => {
      setEventData({
        ...getDefaultEvent(),
        start: slotInfo.start,
        end: slotInfo.end,
      });

      openModal();
    },
    [openModal]
  );
  return { handleSelectEvent, handleSelectSlot, eventData, setEventData };
}

import { useCallback } from "react";
import type { Event } from "../../../../db/scheduleDb";
import { useEventDataContext } from "../useContext/useEventDataContext";

export function useSelectEvent(openModal: () => void, clearHover: () => void) {
  const { eventData, setEventData } = useEventDataContext();

  const handleSelectEvent = useCallback(
    (event: Event) => {
      if (clearHover) clearHover();
      setEventData(event);
      openModal();
    },
    [openModal, clearHover, setEventData]
  );
  return { handleSelectEvent, eventData };
}

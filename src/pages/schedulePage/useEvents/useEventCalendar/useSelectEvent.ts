import { useCallback } from "react";
import type { Event } from "../../../../db/scheduleDb";
import { useEventDataContext } from "../useContext/useEventDataContext";

export function useSelectEvent(openModal: () => void) {
  const { eventData, setEventData } = useEventDataContext();

  const handleSelectEvent = useCallback(
    (event: Event) => {
      setEventData(event);
      openModal();
    },
    [openModal, setEventData]
  );
  return { handleSelectEvent, eventData };
}

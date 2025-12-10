import { getDefaultEvent } from "../../../../utils/getDefaultEvent";
import { useCallback } from "react";
import { useEventDataContext } from "../useContext/useEventDataContext";

export function useAddEvent(openModal: () => void) {
  const { eventData, setEventData } = useEventDataContext();

  const handleAddEvent = useCallback(() => {
    setEventData(getDefaultEvent());
    openModal();
  }, [openModal, setEventData]);
  return { handleAddEvent, eventData };
}

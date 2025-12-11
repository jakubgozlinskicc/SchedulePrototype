import { getDefaultEvent } from "../../../../../utils/getDefaultEvent/getDefaultEvent";
import { useCallback } from "react";
import { useEventDataContext } from "../../useEventDataContext/useEventDataContext";

export function useAddEvent(openModal: () => void) {
  const { setEventData } = useEventDataContext();

  const handleAddEvent = useCallback(() => {
    setEventData(getDefaultEvent());
    openModal();
  }, [openModal, setEventData]);
  return { handleAddEvent };
}

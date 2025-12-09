import { useCallback } from "react";
import { getDefaultEvent } from "../../../../utils/getDefaultEvent";
import type { SlotInfo } from "react-big-calendar";
import { useEventDataContext } from "../useContext/useEventDataContext";

export function useSelectSlot(openModal: () => void) {
  const { eventData, setEventData } = useEventDataContext();

  const handleSelectSlot = useCallback(
    (slotInfo: SlotInfo) => {
      setEventData({
        ...getDefaultEvent(),
        start: slotInfo.start,
        end: slotInfo.end,
      });

      openModal();
    },
    [openModal, setEventData]
  );
  return { handleSelectSlot, eventData };
}

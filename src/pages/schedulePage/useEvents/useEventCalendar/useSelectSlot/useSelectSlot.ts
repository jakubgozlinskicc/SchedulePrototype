import { getDefaultEvent } from "../../../../../utils/getDefaultEvent/getDefaultEvent";
import type { SlotInfo } from "react-big-calendar";
import { useEventDataContext } from "../../../../../events/useEvents/useEventDataContext/useEventDataContext";

export function useSelectSlot(openModal: () => void) {
  const { eventData, setEventData } = useEventDataContext();

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setEventData({
      ...getDefaultEvent(),
      start: slotInfo.start,
      end: slotInfo.end,
    });

    openModal();
  };
  return { handleSelectSlot, eventData };
}

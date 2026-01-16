import type { Event } from "../../../../../db/scheduleDb";
import { useEventDataContext } from "../../useEventDataContext/useEventDataContext";

export function useSelectEvent(openModal: () => void) {
  const { setEventData } = useEventDataContext();

  const handleSelectEvent = (event: Event) => {
    setEventData(event);
    openModal();
  };
  return { handleSelectEvent };
}

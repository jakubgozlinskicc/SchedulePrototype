import { getDefaultEvent } from "../../../../utils/getDefaultEvent/getDefaultEvent";
import { useEventDataContext } from "../../useEventDataContext/useEventDataContext";

export function useAddEvent(openModal: () => void) {
  const { setEventData } = useEventDataContext();

  const handleAddEvent = () => {
    setEventData(getDefaultEvent());
    openModal();
  };
  return { handleAddEvent };
}

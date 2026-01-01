import { useNavigate } from "react-router-dom";
import { useEventDataContext } from "../../../../events/useEvents/useEventDataContext/useEventDataContext";
import { getDefaultEvent } from "../../../../utils/getDefaultEvent/getDefaultEvent";

export function useNavigateToAddEvent() {
  const navigate = useNavigate();
  const { setEventData, setIsEditAll } = useEventDataContext();

  const handleAddEventClick = () => {
    setEventData(getDefaultEvent());
    setIsEditAll(false);
    navigate("/event/add");
  };

  return { handleAddEventClick };
}

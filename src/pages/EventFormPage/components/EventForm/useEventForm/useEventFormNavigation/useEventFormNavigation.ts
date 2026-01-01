import { useNavigate } from "react-router-dom";
import { useEventDataContext } from "../../../../../../events/useEvents/useEventDataContext/useEventDataContext";
import { getDefaultEvent } from "../../../../../../utils/getDefaultEvent/getDefaultEvent";

export function useEventFormNavigation() {
  const navigate = useNavigate();
  const { setEventData } = useEventDataContext();
  const goToOverview = () => navigate("/overview");
  const handleCancel = () => {
    setEventData(getDefaultEvent);
    navigate("/overview");
  };

  return {
    goToOverview,
    handleCancel,
  };
}

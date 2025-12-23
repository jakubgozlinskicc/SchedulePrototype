import { useNavigate } from "react-router-dom";

export function useEventFormNavigation() {
  const navigate = useNavigate();

  const goToOverview = () => navigate("/overview");
  const handleCancel = () => navigate("/overview");

  return {
    goToOverview,
    handleCancel,
  };
}

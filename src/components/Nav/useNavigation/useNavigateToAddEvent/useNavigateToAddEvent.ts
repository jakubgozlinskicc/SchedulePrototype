import { useNavigate } from "react-router-dom";

export function useNavigateToAddEvent() {
  const navigate = useNavigate();

  const handleAddEventClick = () => {
    navigate("/event/add");
  };

  return { handleAddEventClick };
}

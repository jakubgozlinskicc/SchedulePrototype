import { useNavigate } from "react-router-dom";
import type { Event } from "../../../../../../db/scheduleDb";

export function useEventNavigation() {
  const navigate = useNavigate();

  const handleEditClick = (event: Event) => {
    const dateStr = encodeURIComponent(event.start.toISOString());

    if (!!event.id && event.recurrenceRule?.type !== "none") {
      navigate(`/recurring-event/edit/${event.id}/${dateStr}`);
    } else if (!event.id) {
      navigate(`/recurring-event/edit/${event.recurringEventId}/${dateStr}`);
    } else if (event.id) {
      navigate(`/event/edit/${event.id}`);
    }
  };

  return { handleEditClick };
}

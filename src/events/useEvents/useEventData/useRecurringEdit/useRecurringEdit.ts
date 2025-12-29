import type { IEventRepository } from "../../IEventRepository";
import { useEventDataContext } from "../../useEventDataContext/useEventDataContext";

export function useRecurringEdit(repository: IEventRepository) {
  const { eventData, setEventData, setIsEditAll } = useEventDataContext();

  const handleEditSingle = () => {
    setIsEditAll(false);
    setEventData((prev) => ({
      ...prev,
    }));
  };

  const handleEditAll = async () => {
    setIsEditAll(true);

    if (!eventData.recurringEventId) return;

    try {
      const parentEvent = await repository.getEventById(
        eventData.recurringEventId
      );
      if (parentEvent) {
        setEventData(parentEvent);
      }
    } catch (error) {
      console.error("Error loading parent event:", error);
    }
  };

  return {
    handleEditSingle,
    handleEditAll,
  };
}

import type { IEventRepository } from "../../IEventRepository";
import { useEventDataContext } from "../../useEventDataContext/useEventDataContext";

export function useRecurringEdit(repository: IEventRepository) {
  const { eventData, setEventData, setIsDeleteAll } = useEventDataContext();

  const handleEditSingle = () => {
    setIsDeleteAll(false);
    setEventData((prev) => ({
      ...prev,
    }));
  };

  const handleEditAll = async () => {
    setIsDeleteAll(true);

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

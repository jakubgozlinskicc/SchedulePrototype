import { useEventDataContext } from "../../useEventDataContext/useEventDataContext";
import { useReloadEvents } from "../useReloadEvents/useReloadEvents";
import { DeleteStrategyRegistry } from "../../../../../events/deleteStrategies/deleteStrategyRegistry";
import type { IEventRepository } from "../../../../../events/IEventRepository";

export function useDeleteEvent(
  closeModal: () => void,
  repository: IEventRepository
) {
  const { eventData, isEditAll, setIsEditAll } = useEventDataContext();
  const { reloadEvents } = useReloadEvents(repository);

  const deleteCurrentEvent = async () => {
    try {
      await DeleteStrategyRegistry.executeDelete(eventData, repository, {
        isEditAll,
      });
      await reloadEvents();
      setIsEditAll(false);
      closeModal();
    } catch (error) {
      console.error("Error during deleting event:", error);
    }
  };

  return { deleteCurrentEvent };
}

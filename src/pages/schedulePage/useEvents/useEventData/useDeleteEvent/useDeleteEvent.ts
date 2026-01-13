import { useEventDataContext } from "../../useEventDataContext/useEventDataContext";
import { useReloadEvents } from "../useReloadEvents/useReloadEvents";
import { DeleteStrategyRegistry } from "../../../../../events/deleteStrategies/deleteStrategyRegistry";
import type { IEventRepository } from "../../../../../events/IEventRepository";
import type { DeleteOptions } from "../../../../../events/deleteStrategies/IDeleteStrategy";
import { getDefaultEvent } from "../../../../../utils/getDefaultEvent/getDefaultEvent";

export function useDeleteEvent(
  closeModal: () => void,
  repository: IEventRepository
) {
  const { eventData, setEventData, setIsEditAll } = useEventDataContext();
  const { reloadEvents } = useReloadEvents(repository);

  const deleteCurrentEvent = async (options?: DeleteOptions) => {
    try {
      await DeleteStrategyRegistry.executeDelete(
        eventData,
        repository,
        options
      );
      await reloadEvents();
      setEventData(getDefaultEvent());
      setIsEditAll(false);
      closeModal();
    } catch (error) {
      console.error("Error during deleting event:", error);
    }
  };

  return { deleteCurrentEvent };
}

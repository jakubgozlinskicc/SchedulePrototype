import { type FormEvent } from "react";
import { useEventDataContext } from "../../useEventDataContext/useEventDataContext";
import { useReloadEvents } from "../useReloadEvents/useReloadEvents";
import { SubmitStrategyRegistry } from "./submitStrategies/SubmitStrategyRegistry";
import type { IEventRepository } from "../../IEventRepository";

export function useSubmitEvent(
  closeModal: () => void,
  repository: IEventRepository
) {
  const { eventData } = useEventDataContext();
  const { reloadEvents } = useReloadEvents(repository);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await SubmitStrategyRegistry.executeSubmit(eventData, repository);
      await reloadEvents();
      closeModal();
    } catch (error) {
      console.error("Error during saving events:", error);
    }
  };

  return { handleSubmit };
}

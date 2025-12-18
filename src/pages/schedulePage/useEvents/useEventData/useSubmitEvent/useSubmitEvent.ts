import { type FormEvent } from "react";
import type { IEventRepository } from "../../IEventRepository";
import { useEventDataContext } from "../../useEventDataContext/useEventDataContext";
import { useReloadEvents } from "../useReloadEvents/useReloadEvents";
import { SubmitStrategyRegistry } from "./submitStrategies/SubmitStrategyRegistry";

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

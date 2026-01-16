import { EventModalStrategyRegistry } from "./modalStrategy/modalRegistry";
import "./eventModal.css";
import { useEventDataContext } from "../../useEvents/useEventDataContext/useEventDataContext";
import { useSubmitEvent } from "../../useEvents/useEventData/useSubmitEvent/useSubmitEvent";
import type { IEventRepository } from "../../../../events/IEventRepository";
import type { DeleteOptions } from "../../../../events/deleteStrategies/IDeleteStrategy";

interface EventModalComponentProps {
  repository: IEventRepository;
  onClose: () => void;
  onRequestDelete?: (options?: DeleteOptions) => void | Promise<void>;
}

export function EventModal({
  repository,
  onClose,
  onRequestDelete,
}: EventModalComponentProps) {
  const { eventData } = useEventDataContext();

  const { onSubmit } = useSubmitEvent(onClose, repository, eventData);

  const renderer = EventModalStrategyRegistry.provideRenderer(eventData);

  return renderer.render({
    eventData,
    onClose,
    onSubmit,
    onRequestDelete,
  });
}

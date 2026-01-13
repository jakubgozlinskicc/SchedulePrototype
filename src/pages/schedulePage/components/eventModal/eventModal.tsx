import { EventModalStrategyRegistry } from "./modalStrategy/modalRegistry";
import "./eventModal.css";
import { useEventDataContext } from "../../useEvents/useEventDataContext/useEventDataContext";
import { useSubmitEvent } from "../../useEvents/useEventData/useSubmitEvent/useSubmitEvent";
import { useRecurringEdit } from "../../useEvents/useEventData/useRecurringEdit/useRecurringEdit";
import type { IEventRepository } from "../../../../events/IEventRepository";

interface EventModalComponentProps {
  repository: IEventRepository;
  onClose: () => void;
  onRequestDelete?: () => void | Promise<void>;
}

export function EventModal({
  repository,
  onClose,
  onRequestDelete,
}: EventModalComponentProps) {
  const { handleEditSingle, handleEditAll } = useRecurringEdit(repository);
  const { eventData } = useEventDataContext();

  const { onSubmit } = useSubmitEvent(onClose, repository, eventData);

  const renderer = EventModalStrategyRegistry.provideRenderer(eventData);

  return renderer.render({
    eventData,
    onClose,
    onSubmit,
    onRequestDelete,
    onEditSingle: handleEditSingle,
    onEditAll: handleEditAll,
  });
}

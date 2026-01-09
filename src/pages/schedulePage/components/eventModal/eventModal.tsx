import { EventModalStrategyRegistry } from "./modalStrategy/modalRegistry";
import "./eventModal.css";
import type { IEventRepository } from "../../../../events/useEvents/IEventRepository";
import { useEventDataContext } from "../../../../events/useEvents/useEventDataContext/useEventDataContext";
import { useSubmitEvent } from "../../../../events/useEvents/useEventData/useSubmitEvent/useSubmitEvent";
import { useRecurringEdit } from "../../../../events/useEvents/useEventData/useRecurringEdit/useRecurringEdit";

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

  const { onSubmit } = useSubmitEvent(
    onClose,
    repository,
    eventData.id ? eventData : undefined
  );

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

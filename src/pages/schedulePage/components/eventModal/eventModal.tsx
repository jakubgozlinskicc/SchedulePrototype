import { EventModalStrategyRegistry } from "./modalStrategy/modalRegistry";
import "./eventModal.css";
import type { EventModalProps } from "./eventModalTypes";
import { useEventDataContext } from "../../../../events/useEvents/useEventDataContext/useEventDataContext";
import { useRecurringEdit } from "../../../../events/useEvents/useEventData/useRecurringEdit/useRecurringEdit";
import type { IEventRepository } from "../../../../events/useEvents/IEventRepository";

interface EventModalComponentProps
  extends Omit<EventModalProps, "eventData" | "onEditSingle" | "onEditAll"> {
  repository: IEventRepository;
}

export function EventModal(commonProps: EventModalComponentProps) {
  const { repository, ...restProps } = commonProps;
  const { eventData } = useEventDataContext();
  const { handleEditSingle, handleEditAll } = useRecurringEdit(repository);

  const renderer = EventModalStrategyRegistry.provideRenderer(eventData);

  const fullProps: EventModalProps = {
    ...restProps,
    eventData,
    onEditSingle: handleEditSingle,
    onEditAll: handleEditAll,
  };

  return renderer.render(fullProps);
}

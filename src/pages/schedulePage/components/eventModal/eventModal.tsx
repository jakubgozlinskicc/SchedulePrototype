import { EventModalStrategyRegistry } from "./modalStrategy/modalRegistry";
import "./eventModal.css";
import type { EventModalProps } from "./eventModalTypes";
import { useMemo } from "react";
import { useEventDataContext } from "../../useEvents/useEventDataContext/useEventDataContext";
import { useRecurringEdit } from "../../useEvents/useEventComponents/useRecurringEdit/useRecurringEdit";
import type { IEventRepository } from "../../useEvents/IEventRepository";

interface EventModalComponentProps
  extends Omit<EventModalProps, "eventData" | "onEditSingle" | "onEditAll"> {
  repository: IEventRepository;
}

export function EventModal(commonProps: EventModalComponentProps) {
  const { repository, ...restProps } = commonProps;
  const { eventData } = useEventDataContext();
  const { handleEditSingle, handleEditAll } = useRecurringEdit(repository);

  const renderer = useMemo(
    () => EventModalStrategyRegistry.provideRenderer(eventData),
    [eventData]
  );

  const fullProps: EventModalProps = {
    ...restProps,
    eventData,
    onEditSingle: handleEditSingle,
    onEditAll: handleEditAll,
  };

  return renderer.render(fullProps);
}

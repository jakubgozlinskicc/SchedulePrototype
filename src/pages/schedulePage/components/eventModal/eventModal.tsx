import { EventModalStrategyRegistry } from "./modalStrategy/modalRegistry";
import "./eventModal.css";
import type { EventModalProps } from "./eventModalTypes";
import { useMemo } from "react";
import { useEventDataContext } from "../../useEvents/useEventDataContext/useEventDataContext";

export function EventModal(commonProps: Omit<EventModalProps, "eventData">) {
  const { eventData } = useEventDataContext();

  const renderer = useMemo(
    () => EventModalStrategyRegistry.provideRenderer(eventData),
    [eventData]
  );

  const fullProps: EventModalProps = {
    ...commonProps,
    eventData,
  };

  return renderer.render(fullProps);
}

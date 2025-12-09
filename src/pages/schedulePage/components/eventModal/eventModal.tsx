import { EventModalStrategyRegistry } from "./modalStrategy/modalRegistry";
import "./eventModal.css";
import type { EventModalProps } from "./eventModalProps";
import { useMemo } from "react";

export function EventModal(commonProps: EventModalProps) {
  const renderer = useMemo(
    () => EventModalStrategyRegistry.provideRenderer(commonProps.eventData),
    [commonProps.eventData]
  );
  return renderer.render(commonProps);
}

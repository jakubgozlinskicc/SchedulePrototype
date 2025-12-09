import { EventModalStrategyRegistry } from "./modalStrategy/modalRegistry";
import "./eventModal.css";
import type { EventModalProps } from "./eventModalProps";

export function EventModal(commonProps: EventModalProps) {
  const renderer = EventModalStrategyRegistry.provideRenderer(
    commonProps.eventData
  );
  return renderer.render(commonProps);
}

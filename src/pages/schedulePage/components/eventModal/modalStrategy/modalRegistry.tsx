import type { Event } from "../../../../../db/scheduleDb";
import type { EventModalProps } from "../eventModalProps";
import type { EventModalStrategy } from "./eventStrategies/eventModalStrategy";
import { AddEventStrategy } from "./eventStrategies/addEventStrategy";
import { EditEventStrategy } from "./eventStrategies/editEventStrategy";

const strategies: EventModalStrategy[] = [
  new AddEventStrategy(),
  new EditEventStrategy(),
];
export const EventModalStrategyRegistry = {
  provideRenderer(eventData: Event) {
    const strategy = strategies.find((s) => s.useSupport(eventData));
    if (!strategy) {
      throw new Error(
        `No EventModalStrategy found for event with id=${
          eventData.id ?? "null"
        }`
      );
    }
    return {
      render: (commonProps: EventModalProps) => strategy.render(commonProps),
    };
  },
};

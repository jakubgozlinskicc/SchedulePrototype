import type { Event } from "../../../db/scheduleDb";
import type { IEventFormStrategy } from "../eventFormTypes";
import { AddEventFormStrategy } from "./eventFormStrategies/addEventFormStrategy";
import { EditEventFormStrategy } from "./eventFormStrategies/editEventFormStrategy";
import { EditRecurringEventStrategy } from "./eventFormStrategies/editRecurringEventStrategy";

const strategies: IEventFormStrategy[] = [
  new EditRecurringEventStrategy(),
  new AddEventFormStrategy(),
  new EditEventFormStrategy(),
];

export const EventFormStrategyRegistry = {
  provideRenderer(eventData: Event | null) {
    const strategy = strategies.find((s) => s.canRender(eventData));
    console.log(strategy);

    if (!strategy) {
      throw new Error(
        `No EventFormStrategy found for event with id=${
          eventData?.id ?? "null"
        }`
      );
    }
    return {
      render: () => strategy.render(),
    };
  },
};

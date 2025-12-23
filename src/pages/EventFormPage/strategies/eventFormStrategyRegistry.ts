import type {
  EventFormPageContext,
  IEventFormStrategy,
} from "../eventFormTypes";
import { AddEventFormStrategy } from "./eventFormStrategies/addEventFormStrategy";
import { EditEventFormStrategy } from "./eventFormStrategies/editEventFormStrategy";

const strategies: IEventFormStrategy[] = [
  new AddEventFormStrategy(),
  new EditEventFormStrategy(),
];

export const EventFormStrategyRegistry = {
  getStrategy(context: EventFormPageContext): IEventFormStrategy {
    const strategy = strategies.find((s) => s.canRender(context));

    if (!strategy) {
      throw new Error(`No EventFormStrategy found for mode="${context.mode}"`);
    }

    return strategy;
  },
};

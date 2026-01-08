import type { Event } from "../../../../../db/scheduleDb";
import type { EditOptions, ISubmitStrategy } from "./ISubmitStrategy";
import { SubmitExistingEventStrategy } from "./SubmitExistingEventStrategy";
import { SubmitNewEventStrategy } from "./SubmitNewEventStrategy";
import { SubmitVirtualOccurrenceStrategy } from "./SubmitVirtualOccurenceStrategy";
import type { IEventRepository } from "../../../IEventRepository";
import { SubmitAllRecurringEventsStrategy } from "./SubmitAllRecurringEventsStrategy";

const strategies: ISubmitStrategy[] = [
  new SubmitAllRecurringEventsStrategy(),
  new SubmitVirtualOccurrenceStrategy(),
  new SubmitExistingEventStrategy(),
  new SubmitNewEventStrategy(),
];

export const SubmitStrategyRegistry = {
  async executeSubmit(
    eventData: Event,
    repository: IEventRepository,
    options?: EditOptions
  ): Promise<void> {
    console.log(eventData);
    console.log(options);
    const strategy = strategies.find((s) => s.canExecute(eventData, options));
    if (!strategy) {
      throw new Error("No submit strategy found for event");
    }
    console.log(strategy);
    await strategy.execute(eventData, repository);
  },
};

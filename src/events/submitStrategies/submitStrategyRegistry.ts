import type { Event } from "../../db/scheduleDb";
import type { EditOptions, ISubmitStrategy } from "./ISubmitStrategy";
import { SubmitExistingEventStrategy } from "./submitExistingEventStrategy";
import { SubmitNewEventStrategy } from "./submitNewEventStrategy";
import { SubmitVirtualOccurrenceStrategy } from "./submitVirtualOccurenceStrategy";
import { SubmitAllRecurringEventsStrategy } from "./submitAllRecurringEventsStrategy";
import type { IEventRepository } from "../IEventRepository";

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
    const strategy = strategies.find((s) => s.canExecute(eventData, options));
    if (!strategy) {
      throw new Error("No submit strategy found for event");
    }
    await strategy.execute(eventData, repository);
  },
};

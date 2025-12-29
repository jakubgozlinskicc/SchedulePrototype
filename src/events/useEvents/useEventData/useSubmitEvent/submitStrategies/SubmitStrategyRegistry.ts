import type { Event } from "../../../../../db/scheduleDb";
import type { EditOptions, ISubmitStrategy } from "./ISubmitStrategy";
import { SubmitParentStrategy } from "./SubmitParentStrategy";
import { SubmitExistingEventStrategy } from "./SubmitExistingEventStrategy";
import { SubmitNewEventStrategy } from "./SubmitNewEventStrategy";
import { SubmitVirtualOccurrenceStrategy } from "./SubmitVirtualOccurenceStrategy";
import type { IEventRepository } from "../../../IEventRepository";
import { SubmitAllRecurringEventsStrategy } from "./SubmitAllRecurringEventsStrategy";

const strategies: ISubmitStrategy[] = [
  new SubmitAllRecurringEventsStrategy(),
  new SubmitVirtualOccurrenceStrategy(),
  new SubmitParentStrategy(),
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

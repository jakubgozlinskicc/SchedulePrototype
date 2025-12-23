import type { Event } from "../../../../../db/scheduleDb";
import type { IDeleteStrategy, DeleteOptions } from "./IDeleteStrategy";
import { DeleteAllRecurringEventsStrategy } from "./DeleteAllRecurringEventsStrategy";
import { DeleteRecurringParentStrategy } from "./DeleteRecurringParentStrategy";
import { DeleteVirtualOccurrenceStrategy } from "./DeleteVirtualOccurrenceStrategy";
import { DeleteRegularEventStrategy } from "./DeleteRegularEventStrategy";
import type { IEventRepository } from "../../../IEventRepository";

const strategies: IDeleteStrategy[] = [
  new DeleteAllRecurringEventsStrategy(),
  new DeleteRecurringParentStrategy(),
  new DeleteVirtualOccurrenceStrategy(),
  new DeleteRegularEventStrategy(),
];

export const DeleteStrategyRegistry = {
  async executeDelete(
    eventData: Event,
    repository: IEventRepository,
    options?: DeleteOptions
  ): Promise<void> {
    const strategy = strategies.find((s) => s.canExecute(eventData, options));

    if (!strategy) {
      throw new Error("No delete strategy found for event");
    }

    await strategy.execute(eventData, repository);
  },
};

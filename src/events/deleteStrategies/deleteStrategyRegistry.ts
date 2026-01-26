import type { Event } from "../../db/scheduleDb";
import type { IDeleteStrategy, DeleteOptions } from "./IDeleteStrategy";
import { DeleteAllRecurringEventsStrategy } from "./deleteAllRecurringEventsStrategy";
import { DeleteRecurringParentStrategy } from "./deleteRecurringParentStrategy";
import { DeleteVirtualOccurrenceStrategy } from "./deleteVirtualOccurrenceStrategy";
import { DeleteRegularEventStrategy } from "./deleteRegularEventStrategy";
import type { IEventRepository } from "../IEventRepository";

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

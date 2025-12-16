import type { Event } from "../../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";
import type { IDeleteStrategy } from "./IDeleteStrategy";
import { DeleteRecurringParentStrategy } from "./DeleteRecurringParentStrategy";
import { DeleteExceptionStrategy } from "./DeleteExceptionStrategy";
import { DeleteVirtualOccurrenceStrategy } from "./DeleteVirtualOccurrenceStrategy";
import { DeleteRegularEventStrategy } from "./DeleteRegularEventStrategy";

const strategies: IDeleteStrategy[] = [
  new DeleteRecurringParentStrategy(),
  new DeleteExceptionStrategy(),
  new DeleteVirtualOccurrenceStrategy(),
  new DeleteRegularEventStrategy(),
];

export const DeleteStrategyRegistry = {
  async executeDelete(
    eventData: Event,
    repository: IEventRepository
  ): Promise<void> {
    const strategy = strategies.find((s) => s.canSupport(eventData));

    if (!strategy) {
      throw new Error("No delete strategy found for event");
    }

    await strategy.execute(eventData, repository);
  },
};

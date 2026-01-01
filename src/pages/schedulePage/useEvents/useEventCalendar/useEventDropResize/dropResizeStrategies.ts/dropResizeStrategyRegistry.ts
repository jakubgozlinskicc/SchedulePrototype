import type { IDropResizeStrategy } from "./dropResizeStrategyTypes";
import type { Event } from "../../../../../../db/scheduleDb";
import { DropResizeParentStrategy } from "./dropResizeParentStrategy";
import { DropResizeRegularEventStrategy } from "./dropResizeRegularEventStrategy";
import { DropResizeVirtualOccurrenceStrategy } from "./dropResizeVirtualOccurenceStrategy";
import type { IEventRepository } from "../../../../../../events/useEvents/IEventRepository";

const strategies: IDropResizeStrategy[] = [
  new DropResizeVirtualOccurrenceStrategy(),
  new DropResizeParentStrategy(),
  new DropResizeRegularEventStrategy(),
];

export const DropResizeStrategyRegistry = {
  async executeDropResize(
    eventData: Event,
    start: Date,
    end: Date,
    repository: IEventRepository
  ): Promise<void> {
    const strategy = strategies.find((s) => s.canExecute(eventData));
    if (!strategy) {
      throw new Error("No drop/resize strategy found for event");
    }
    await strategy.execute(eventData, start, end, repository);
  },
};

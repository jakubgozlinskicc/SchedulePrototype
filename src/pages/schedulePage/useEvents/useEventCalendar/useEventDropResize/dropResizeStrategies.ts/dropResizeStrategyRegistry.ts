import type { IDropResizeStrategy } from "./dropResizeStrategyTypes";
import type { Event } from "../../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";
import { DropResizeParentStrategy } from "./dropResizeParentStrategy";
import { DropResizeRegularEventStrategy } from "./dropResizeRegularEvent";
import { DropResizeVirtualOccurrenceStrategy } from "./dropResizeVirtualOccurenceStrategy";

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

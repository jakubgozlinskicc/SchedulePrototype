import type { Event } from "../../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";
import type { ISubmitStrategy } from "./ISubmitStrategy";
import { SubmitParentStrategy } from "./SubmitParentStrategy";
import { SubmitExistingEventStrategy } from "./SubmitExistingEventStrategy";
import { SubmitNewEventStrategy } from "./SubmitNewEventStrategy";
import { SubmitVirtualOccurrenceStrategy } from "./SubmitVirtualOccurenceStrategy";

const strategies: ISubmitStrategy[] = [
  new SubmitVirtualOccurrenceStrategy(),
  new SubmitParentStrategy(),
  new SubmitExistingEventStrategy(),
  new SubmitNewEventStrategy(),
];

export const SubmitStrategyRegistry = {
  async executeSubmit(
    eventData: Event,
    repository: IEventRepository
  ): Promise<void> {
    const strategy = strategies.find((s) => s.canExecute(eventData));

    if (!strategy) {
      throw new Error("No submit strategy found for event");
    }

    await strategy.execute(eventData, repository);
  },
};

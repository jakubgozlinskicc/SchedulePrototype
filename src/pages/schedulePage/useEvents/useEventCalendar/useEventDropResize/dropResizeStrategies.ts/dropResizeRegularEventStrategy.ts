import type { IDropResizeStrategy } from "./dropResizeStrategyTypes";
import type { Event } from "../../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../../../../events/useEvents/IEventRepository";

export class DropResizeRegularEventStrategy implements IDropResizeStrategy {
  canExecute(eventData: Event): boolean {
    return !!eventData.id && eventData.recurrenceRule?.type === "none";
  }

  async execute(
    eventData: Event,
    start: Date,
    end: Date,
    repository: IEventRepository
  ): Promise<void> {
    if (!eventData.id) return;
    await repository.editEvent(eventData.id, { start, end });
  }
}

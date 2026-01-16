import type { Event } from "../../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../../../../events/IEventRepository";
import { setNewParentEvent } from "../../../../../../events/recurringLogic/setNewParentEvent";
import type { IDropResizeStrategy } from "./dropResizeStrategyTypes";

export class DropResizeParentStrategy implements IDropResizeStrategy {
  canExecute(eventData: Event): boolean {
    return !!eventData.id && eventData.recurrenceRule?.type !== "none";
  }
  async execute(
    eventData: Event,
    start: Date,
    end: Date,
    repository: IEventRepository
  ): Promise<void> {
    await setNewParentEvent(repository, eventData);

    await repository.editEvent(eventData.id!, {
      ...eventData,
      start,
      end,
      recurrenceRule: { type: "none", interval: 1 },
      cancelledDates: [],
    });
  }
}

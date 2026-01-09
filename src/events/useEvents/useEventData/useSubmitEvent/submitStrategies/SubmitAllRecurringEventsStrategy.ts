import type { Event } from "../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";
import type { EditOptions, ISubmitStrategy } from "./ISubmitStrategy";

export class SubmitAllRecurringEventsStrategy implements ISubmitStrategy {
  canExecute(eventData: Event, options?: EditOptions): boolean {
    const isRecurring =
      eventData.recurrenceRule?.type !== "none" || !!eventData.recurringEventId;
    return isRecurring && options?.isEditAll === true;
  }
  async execute(eventData: Event, repository: IEventRepository): Promise<void> {
    const parentId = eventData.recurringEventId ?? eventData.id;

    await repository.editEvent(parentId!, eventData);
  }
}

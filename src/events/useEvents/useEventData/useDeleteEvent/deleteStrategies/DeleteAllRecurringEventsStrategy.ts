import type { IDeleteStrategy, DeleteOptions } from "./IDeleteStrategy";
import type { Event } from "../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";

export class DeleteAllRecurringEventsStrategy implements IDeleteStrategy {
  canExecute(eventData: Event, options?: DeleteOptions): boolean {
    const isRecurring =
      eventData.recurrenceRule?.type !== "none" || !!eventData.recurringEventId;

    return isRecurring && options?.isDeleteAll === true;
  }

  async execute(eventData: Event, repository: IEventRepository): Promise<void> {
    const parentId = eventData.recurringEventId ?? eventData.id;
    await repository.deleteEvent(parentId!);
  }
}

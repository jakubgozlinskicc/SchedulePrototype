import type { Event } from "../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";
import { setNewParentEvent } from "../../useRecurringEdit/setNewParentEvent";
import type { IDeleteStrategy, DeleteOptions } from "./IDeleteStrategy";

export class DeleteRecurringParentStrategy implements IDeleteStrategy {
  canExecute(eventData: Event, options?: DeleteOptions): boolean {
    return (
      !!eventData.id &&
      eventData.recurrenceRule?.type !== "none" &&
      options?.isEditAll === false
    );
  }

  async execute(eventData: Event, repository: IEventRepository): Promise<void> {
    await setNewParentEvent(repository, eventData);
    await repository.deleteEvent(eventData.id!);
  }
}

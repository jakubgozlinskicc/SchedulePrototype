import type { Event } from "../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";
import { setNewParentEvent } from "../../useRecurringEdit/setNewParentEvent";
import type { EditOptions, ISubmitStrategy } from "./ISubmitStrategy";

export class SubmitParentStrategy implements ISubmitStrategy {
  canExecute(eventData: Event, options: EditOptions): boolean {
    return (
      !!eventData.id &&
      eventData.recurrenceRule?.type !== "none" &&
      options?.isEditAll === false
    );
  }

  async execute(eventData: Event, repository: IEventRepository): Promise<void> {
    await setNewParentEvent(repository, eventData);

    await repository.editEvent(eventData.id!, {
      ...eventData,
      recurrenceRule: { type: "none", interval: 1 },
      cancelledDates: [],
    });
  }
}

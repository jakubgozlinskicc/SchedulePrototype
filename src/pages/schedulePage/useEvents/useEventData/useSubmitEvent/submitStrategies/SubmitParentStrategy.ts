import type { Event } from "../../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";
import { setNewParentEvent } from "../../../useEventComponents/useRecurringEdit/setNewParentEvent";
import type { ISubmitStrategy } from "./ISubmitStrategy";

export class SubmitParentStrategy implements ISubmitStrategy {
  canExecute(eventData: Event): boolean {
    return !!eventData.id && eventData.recurrenceRule?.type !== "none";
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

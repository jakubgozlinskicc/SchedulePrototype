import type { Event } from "../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";
import { setNewParentEvent } from "../../useRecurringEdit/setNewParentEvent";
import type { EditOptions, ISubmitStrategy } from "./ISubmitStrategy";

export class SubmitExistingEventStrategy implements ISubmitStrategy {
  canExecute(eventData: Event, options: EditOptions): boolean {
    return !!eventData.id && options?.isEditAll === false;
  }

  async execute(eventData: Event, repository: IEventRepository): Promise<void> {
    const originalEvent = await repository.getEventById(eventData.id!);

    if (!originalEvent || originalEvent.recurrenceRule?.type === "none") {
      await repository.editEvent(eventData.id!, eventData);
      return;
    }

    await setNewParentEvent(repository, eventData);

    await repository.editEvent(eventData.id!, {
      ...eventData,
      recurrenceRule: { type: "none", interval: 1 },
      cancelledDates: [],
    });
  }
}

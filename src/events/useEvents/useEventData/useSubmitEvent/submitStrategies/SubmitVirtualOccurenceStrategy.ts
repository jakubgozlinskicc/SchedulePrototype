import type { Event } from "../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";
import type { ISubmitStrategy } from "./ISubmitStrategy";

export class SubmitVirtualOccurrenceStrategy implements ISubmitStrategy {
  canExecute(eventData: Event): boolean {
    return !eventData.id && !!eventData.recurringEventId;
  }

  async execute(eventData: Event, repository: IEventRepository): Promise<void> {
    const parentEvent = await repository.getEventById(
      eventData.recurringEventId!
    );

    if (!parentEvent) {
      throw new Error("Parent event not found");
    }

    const cancelledDates = parentEvent.cancelledDates ?? [];
    const dateToCancel = eventData.originalStart ?? eventData.start;
    cancelledDates.push(dateToCancel.getTime());

    await repository.editEvent(parentEvent.id!, { cancelledDates });

    await repository.addEvent({
      ...eventData,
      recurrenceRule: { type: "none", interval: 1 },
      recurringEventId: undefined,
    });
  }
}

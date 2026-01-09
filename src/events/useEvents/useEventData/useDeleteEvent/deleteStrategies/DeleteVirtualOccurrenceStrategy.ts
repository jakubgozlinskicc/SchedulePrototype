import type { Event } from "../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";
import type { IDeleteStrategy, DeleteOptions } from "./IDeleteStrategy";

export class DeleteVirtualOccurrenceStrategy implements IDeleteStrategy {
  canExecute(eventData: Event, options?: DeleteOptions): boolean {
    return (
      !eventData.id &&
      !!eventData.recurringEventId &&
      options?.isEditAll === false
    );
  }

  async execute(eventData: Event, repository: IEventRepository): Promise<void> {
    const allEvents = await repository.getEvents();
    const parentEvent = allEvents.find(
      (e) => e.id === eventData.recurringEventId
    );

    if (parentEvent) {
      const cancelledDates = parentEvent.cancelledDates ?? [];
      const dateToCancel = eventData.originalStart ?? eventData.start;
      cancelledDates.push(dateToCancel.getTime());

      await repository.editEvent(parentEvent.id!, { cancelledDates });
    }
  }
}

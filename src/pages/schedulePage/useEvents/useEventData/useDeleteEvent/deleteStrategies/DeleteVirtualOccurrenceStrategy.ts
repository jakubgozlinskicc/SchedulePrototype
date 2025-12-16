import type { Event } from "../../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";
import type { IDeleteStrategy } from "./IDeleteStrategy";

export class DeleteVirtualOccurrenceStrategy implements IDeleteStrategy {
  canSupport(eventData: Event): boolean {
    return !eventData.id && !!eventData.recurringEventId;
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

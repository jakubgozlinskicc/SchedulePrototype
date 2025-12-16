import type { Event } from "../../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";
import type { IDeleteStrategy } from "./IDeleteStrategy";

export class DeleteRecurringParentStrategy implements IDeleteStrategy {
  canSupport(eventData: Event): boolean {
    return (
      !!eventData.id &&
      eventData.recurrenceRule?.type !== "none" &&
      !eventData.isException
    );
  }

  async execute(eventData: Event, repository: IEventRepository): Promise<void> {
    await repository.deleteEvent(eventData.id!);

    const allEvents = await repository.getEvents();
    const exceptions = allEvents.filter(
      (e) => e.recurringEventId === eventData.id && e.isException
    );

    for (const exception of exceptions) {
      if (exception.id) {
        await repository.deleteEvent(exception.id);
      }
    }
  }
}

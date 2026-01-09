import type { Event } from "../../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../../../../events/useEvents/IEventRepository";
import type { IDropResizeStrategy } from "./dropResizeStrategyTypes";

export class DropResizeVirtualOccurrenceStrategy
  implements IDropResizeStrategy
{
  canExecute(eventData: Event): boolean {
    return !eventData.id && !!eventData.recurringEventId;
  }

  async execute(
    eventData: Event,
    start: Date,
    end: Date,
    repository: IEventRepository
  ): Promise<void> {
    const parentEvent = await repository.getEventById(
      eventData.recurringEventId!
    );
    if (!parentEvent) throw new Error("Parent event not found");

    const cancelledDates = parentEvent.cancelledDates ?? [];
    const dateToCancel = eventData.originalStart ?? eventData.start;
    cancelledDates.push(dateToCancel.getTime());

    await repository.editEvent(parentEvent.id!, { cancelledDates });

    await repository.addEvent({
      ...eventData,
      start,
      end,
      recurrenceRule: { type: "none", interval: 1 },
      recurringEventId: undefined,
    });
  }
}

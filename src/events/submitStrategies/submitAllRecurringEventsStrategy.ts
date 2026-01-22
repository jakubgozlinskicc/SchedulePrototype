import { differenceInCalendarDays, addDays } from "date-fns";
import type { Event } from "../../db/scheduleDb";
import type { IEventRepository } from "../IEventRepository";
import type { EditOptions, ISubmitStrategy } from "./ISubmitStrategy";

export class SubmitAllRecurringEventsStrategy implements ISubmitStrategy {
  canExecute(eventData: Event, options?: EditOptions): boolean {
    const hasEventReference = !!eventData.id || !!eventData.recurringEventId;
    return hasEventReference && options?.isEditAll === true;
  }

  async execute(eventData: Event, repository: IEventRepository): Promise<void> {
    const parentId = eventData.recurringEventId ?? eventData.id;
    const parentEvent = await repository.getEventById(parentId!);

    if (!parentEvent) {
      throw new Error("Parent event not found");
    }

    if (eventData.id === parentId) {
      await repository.editEvent(parentId!, {
        title: eventData.title,
        description: eventData.description,
        color: eventData.color,
        recurrenceRule: eventData.recurrenceRule,
        start: eventData.start,
        end: eventData.end,
      });
      return;
    }

    const originalOccurrenceStart = eventData.originalStart || eventData.start;

    const daysDiff = differenceInCalendarDays(
      eventData.start,
      originalOccurrenceStart,
    );
    const timeDiff =
      eventData.start.getTime() - originalOccurrenceStart.getTime();
    const minutesDiff = Math.floor(
      (timeDiff % (24 * 60 * 60 * 1000)) / (60 * 1000),
    );

    let newStart = addDays(parentEvent.start, daysDiff);
    newStart = new Date(newStart.getTime() + minutesDiff * 60 * 1000);

    const duration = eventData.end.getTime() - eventData.start.getTime();
    const newEnd = new Date(newStart.getTime() + duration);

    await repository.editEvent(parentId!, {
      title: eventData.title,
      description: eventData.description,
      color: eventData.color,
      recurrenceRule: eventData.recurrenceRule,
      start: newStart,
      end: newEnd,
    });
  }
}

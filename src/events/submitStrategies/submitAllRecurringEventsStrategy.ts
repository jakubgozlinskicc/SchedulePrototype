import { addDays, differenceInCalendarDays } from "date-fns";
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

    const daysDifference = differenceInCalendarDays(
      eventData.start,
      parentEvent.start,
    );

    const newStart = addDays(parentEvent.start, daysDifference);
    newStart.setHours(eventData.start.getHours());
    newStart.setMinutes(eventData.start.getMinutes());

    const duration = eventData.end.getTime() - eventData.start.getTime();

    const newEnd = new Date(newStart.getTime() + duration);

    console.log(`newStart: ${newStart}, newEnd: ${newEnd}`);
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

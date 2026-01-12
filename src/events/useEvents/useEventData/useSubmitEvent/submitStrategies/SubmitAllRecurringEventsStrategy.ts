import type { Event } from "../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";
import type { EditOptions, ISubmitStrategy } from "./ISubmitStrategy";

export class SubmitAllRecurringEventsStrategy implements ISubmitStrategy {
  canExecute(eventData: Event, options?: EditOptions): boolean {
    const isRecurring =
      eventData.recurrenceRule?.type !== "none" || !!eventData.recurringEventId;
    return isRecurring && options?.isEditAll === true;
  }
  async execute(eventData: Event, repository: IEventRepository): Promise<void> {
    const parentId = eventData.recurringEventId ?? eventData.id;

    const parentEvent = await repository.getEventById(parentId!);

    if (!parentEvent) {
      throw new Error("Parent event not found");
    }

    const newStart = new Date(parentEvent.start);
    newStart.setHours(eventData.start.getHours());
    newStart.setMinutes(eventData.start.getMinutes());

    const newEnd = new Date(parentEvent.end);
    newEnd.setHours(eventData.end.getHours());
    newEnd.setMinutes(eventData.end.getMinutes());

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

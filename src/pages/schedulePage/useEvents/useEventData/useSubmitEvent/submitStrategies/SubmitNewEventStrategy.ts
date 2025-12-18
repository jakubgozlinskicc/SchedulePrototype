import type { Event } from "../../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";
import type { ISubmitStrategy } from "./ISubmitStrategy";

export class SubmitNewEventStrategy implements ISubmitStrategy {
  canExecute(eventData: Event): boolean {
    return (
      !eventData.id &&
      !eventData.recurringEventId &&
      eventData.recurrenceRule?.type === "none"
    );
  }

  async execute(eventData: Event, repository: IEventRepository): Promise<void> {
    await repository.addEvent(eventData);
  }
}

import type { Event } from "../../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";
import type { IDeleteStrategy } from "./IDeleteStrategy";

export class DeleteExceptionStrategy implements IDeleteStrategy {
  canSupport(eventData: Event): boolean {
    return !!eventData.id && !!eventData.isException;
  }

  async execute(eventData: Event, repository: IEventRepository): Promise<void> {
    await repository.deleteEvent(eventData.id!);
  }
}

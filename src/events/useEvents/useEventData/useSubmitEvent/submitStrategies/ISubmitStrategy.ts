import type { Event } from "../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";

export interface ISubmitStrategy {
  canExecute(eventData: Event): boolean;
  execute(eventData: Event, repository: IEventRepository): Promise<void>;
}

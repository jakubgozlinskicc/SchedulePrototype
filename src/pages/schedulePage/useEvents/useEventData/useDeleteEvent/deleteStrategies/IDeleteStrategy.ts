import type { Event } from "../../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";

export interface IDeleteStrategy {
  canSupport(eventData: Event): boolean;
  execute(eventData: Event, repository: IEventRepository): Promise<void>;
}

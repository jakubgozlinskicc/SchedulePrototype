import type { Event } from "../../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";

export interface IDeleteStrategy {
  canExecute(eventData: Event, options?: DeleteOptions): boolean;
  execute(eventData: Event, repository: IEventRepository): Promise<void>;
}

export type DeleteOptions = {
  isDeleteAll?: boolean;
};

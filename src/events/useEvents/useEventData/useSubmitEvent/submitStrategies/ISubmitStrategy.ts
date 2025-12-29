import type { Event } from "../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";

export interface ISubmitStrategy {
  canExecute(eventData: Event, options?: EditOptions): boolean;
  execute(eventData: Event, repository: IEventRepository): Promise<void>;
}

export type EditOptions = {
  isEditAll?: boolean;
};

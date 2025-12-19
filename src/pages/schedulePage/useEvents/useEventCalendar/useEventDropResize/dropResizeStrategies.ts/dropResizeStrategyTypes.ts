import type { Event } from "../../../../../../db/scheduleDb";
import type { IEventRepository } from "../../../IEventRepository";

export type DragDropArgs = {
  event: Event;
  start: Date | string;
  end: Date | string;
  allDay?: boolean;
};

export interface IDropResizeStrategy {
  canExecute(eventData: Event): boolean;
  execute(
    eventData: Event,
    start: Date,
    end: Date,
    repository: IEventRepository
  ): Promise<void>;
}

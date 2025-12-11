import type { Event } from "../../../../../../db/scheduleDb";
import type { EventModalProps } from "../../eventModalTypes";
import type { ReactNode } from "react";
import type { IEventModalStrategy } from "../../eventModalTypes";
import { AddEventModal } from "../../modalComponents/addEventModal";

export class AddEventStrategy implements IEventModalStrategy {
  canSupport(eventData: Event): boolean {
    return !eventData.id;
  }

  render(commonProps: EventModalProps): ReactNode {
    return <AddEventModal {...commonProps} />;
  }
}

import type { Event } from "../../../../../../db/scheduleDb";
import type { EventModalProps } from "../../eventModalProps";
import type { ReactNode } from "react";
import type { EventModalStrategy } from "./eventModalStrategy";
import { AddEventModal } from "../../modalComponents/addEventModal";

export class AddEventStrategy implements EventModalStrategy {
  useSupport(eventData: Event): boolean {
    return !eventData.id;
  }

  render(commonProps: EventModalProps): ReactNode {
    return <AddEventModal {...commonProps} />;
  }
}

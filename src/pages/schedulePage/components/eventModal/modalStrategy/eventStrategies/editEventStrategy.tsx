import type { Event } from "../../../../../../db/scheduleDb";
import type { ReactNode } from "react";
import type { EventModalProps } from "../../eventModalProps";
import type { EventModalStrategy } from "./eventModalStrategy";
import { EditEventModal } from "../../modalComponents/editEventModal";

export class EditEventStrategy implements EventModalStrategy {
  useSupport(eventData: Event): boolean {
    return !!eventData.id;
  }

  render(commonProps: EventModalProps): ReactNode {
    return <EditEventModal {...commonProps} />;
  }
}

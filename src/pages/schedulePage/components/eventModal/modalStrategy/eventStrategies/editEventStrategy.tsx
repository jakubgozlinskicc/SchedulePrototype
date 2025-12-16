import type { Event } from "../../../../../../db/scheduleDb";
import type { ReactNode } from "react";
import type { EventModalProps } from "../../eventModalTypes";
import type { IEventModalStrategy } from "../../eventModalTypes";
import { EditEventModal } from "../../modalComponents/editEventModal";

export class EditEventStrategy implements IEventModalStrategy {
  canSupport(eventData: Event): boolean {
    return !!eventData.id;
  }

  render(commonProps: EventModalProps): ReactNode {
    return (
      <EditEventModal
        {...commonProps}
        onRequestDelete={commonProps.onRequestDelete ?? (() => {})}
      />
    );
  }
}

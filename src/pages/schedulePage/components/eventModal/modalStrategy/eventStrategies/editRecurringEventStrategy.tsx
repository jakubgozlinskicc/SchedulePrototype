import type { Event } from "../../../../../../db/scheduleDb";
import type { ReactNode } from "react";
import type { EventModalProps } from "../../eventModalTypes";
import type { IEventModalStrategy } from "../../eventModalTypes";
import { EditRecurringEventModal } from "../../modalComponents/editRecurringEventModal";

export class EditRecurringEventStrategy implements IEventModalStrategy {
  canSupport(eventData: Event): boolean {
    return (
      (!eventData.id && !!eventData.recurringEventId) ||
      (!!eventData.id && !!eventData.isException)
    );
  }

  render(commonProps: EventModalProps): ReactNode {
    return (
      <EditRecurringEventModal
        {...commonProps}
        onRequestDelete={commonProps.onRequestDelete ?? (() => {})}
        onEditSingle={commonProps.onEditSingle ?? (() => {})}
        onEditAll={commonProps.onEditAll ?? (() => {})}
      />
    );
  }
}

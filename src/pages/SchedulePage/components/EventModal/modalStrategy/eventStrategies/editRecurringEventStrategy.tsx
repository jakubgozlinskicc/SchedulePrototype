import type { Event } from "../../../../../../db/scheduleDb";
import type { ReactNode } from "react";
import type {
  EventModalProps,
  IEventModalStrategy,
} from "../../eventModalTypes";
import { EditRecurringEventModal } from "../../modalComponents/EditRecurringEventModal/EditRecurringEventModal";

export class EditRecurringEventStrategy implements IEventModalStrategy {
  canSupport(eventData: Event): boolean {
    return (
      (!eventData.id && !!eventData.recurringEventId) ||
      (!!eventData.id && eventData.recurrenceRule?.type !== "none")
    );
  }

  render(commonProps: EventModalProps): ReactNode {
    return (
      <EditRecurringEventModal
        eventData={commonProps.eventData}
        onClose={commonProps.onClose}
        onSubmit={commonProps.onSubmit}
        onRequestDelete={commonProps.onRequestDelete ?? (() => {})}
      />
    );
  }
}

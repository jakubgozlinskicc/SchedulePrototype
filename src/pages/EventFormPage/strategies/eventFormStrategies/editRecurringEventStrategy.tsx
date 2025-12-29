import type { ReactNode } from "react";
import type { Event } from "../../../../db/scheduleDb";
import type { IEventFormStrategy } from "../../eventFormTypes";
import { EditRecurringEventForm } from "../../components/EditRecurringEventForm/EditRecurringEventForm";

export class EditRecurringEventStrategy implements IEventFormStrategy {
  canRender(eventData: Event | null): boolean {
    return (
      (!eventData?.id && !!eventData?.recurringEventId) ||
      (!!eventData?.id && eventData.recurrenceRule?.type !== "none")
    );
  }
  render(): ReactNode {
    return <EditRecurringEventForm />;
  }
}

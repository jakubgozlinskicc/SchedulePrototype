import type { ReactNode } from "react";
import type { IEventFormStrategy } from "../../eventFormTypes";
import type { Event } from "../../../../db/scheduleDb";
import { EditEventForm } from "../../components/EditEventForm";

export class EditEventFormStrategy implements IEventFormStrategy {
  canRender(eventData: Event | null): boolean {
    return !!eventData?.id;
  }

  render(): ReactNode {
    return <EditEventForm />;
  }
}

import type { ReactNode } from "react";
import type { IEventFormStrategy } from "../../eventFormTypes";
import type { Event } from "../../../../db/scheduleDb";
import { AddEventForm } from "../../components/AddEventForm";

export class AddEventFormStrategy implements IEventFormStrategy {
  canRender(eventData: Event | null): boolean {
    return !eventData || !eventData.id;
  }

  render(): ReactNode {
    return <AddEventForm />;
  }
}

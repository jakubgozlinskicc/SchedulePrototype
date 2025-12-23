import type { ReactNode } from "react";
import type {
  IEventFormStrategy,
  EventFormPageContext,
} from "../../eventFormTypes";
import { EditEventForm } from "../../components/EditEventForm";

export class EditEventFormStrategy implements IEventFormStrategy {
  canRender(context: EventFormPageContext): boolean {
    return context.mode === "edit";
  }

  render(context: EventFormPageContext): ReactNode {
    return <EditEventForm eventId={context.eventId} />;
  }
}

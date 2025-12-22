import type { ReactNode } from "react";
import type {
  IEventFormStrategy,
  EventFormPageContext,
} from "../../eventFormTypes";
import { AddEventForm } from "../../components/AddEventForm";

export class AddEventFormStrategy implements IEventFormStrategy {
  canRender(context: EventFormPageContext): boolean {
    return context.mode === "add";
  }

  render(): ReactNode {
    return <AddEventForm />;
  }
}

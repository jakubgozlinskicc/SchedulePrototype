import type { ReactNode } from "react";

export interface EventFormPageContext {
  mode: "add" | "edit";
  eventId?: number;
}

export interface EventFormContentProps {
  eventId?: number;
}

export interface IEventFormStrategy {
  canRender: (context: EventFormPageContext) => boolean;
  render: (context: EventFormPageContext) => ReactNode;
}

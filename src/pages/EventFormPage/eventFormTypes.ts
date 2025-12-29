import type { ReactNode } from "react";
import type { Event } from "../../db/scheduleDb";

export interface EventFormRenderProps {
  handleCancel: () => void;
  handleDelete: () => void;
}

export interface EventFormProps {
  title: string;
  children: (props: EventFormRenderProps) => ReactNode;
}

export interface IEventFormStrategy {
  canRender: (eventData: Event | null) => boolean;
  render: () => ReactNode;
}

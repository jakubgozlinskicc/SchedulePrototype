import type { ReactNode } from "react";
import type { Event } from "../../../../db/scheduleDb";
import type { EventFormData } from "../../../../events/form/EventForm/eventFormSchema";
import type { DeleteOptions } from "../../../../events/deleteStrategies/IDeleteStrategy";
import type { EditOptions } from "../../../../events/submitStrategies/ISubmitStrategy";

export interface EventModalProps {
  eventData: Event;
  onClose: () => void;
  onSubmit: (
    data: EventFormData,
    options?: EditOptions
  ) => void | Promise<void>;
  onRequestDelete?: (options?: DeleteOptions) => void | Promise<void>;
}

export interface IEventModalStrategy {
  canSupport: (eventData: Event) => boolean;
  render: (props: EventModalProps) => ReactNode;
}

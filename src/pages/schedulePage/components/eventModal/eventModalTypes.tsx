import type { ReactNode } from "react";
import type { Event } from "../../../../db/scheduleDb";
import type { EventFormData } from "../../../../events/form/EventForm/eventFormSchema";
import type { DeleteOptions } from "../../../../events/deleteStrategies/IDeleteStrategy";

export interface EventModalProps {
  eventData: Event;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void | Promise<void>;
  onRequestDelete?: (options?: DeleteOptions) => void | Promise<void>;
  onEditSingle?: () => void;
  onEditAll?: () => void;
}

export interface IEventModalStrategy {
  canSupport: (eventData: Event) => boolean;
  render: (props: EventModalProps) => ReactNode;
}

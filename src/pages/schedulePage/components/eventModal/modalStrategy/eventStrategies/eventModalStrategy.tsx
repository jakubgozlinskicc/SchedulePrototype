import type { Event } from "../../../../../../db/scheduleDb";
import type { EventModalProps } from "../../eventModalProps";
import type { ReactNode } from "react";

export interface EventModalStrategy {
  useSupport: (eventData: Event) => boolean;
  render: (commonProps: EventModalProps) => ReactNode;
}

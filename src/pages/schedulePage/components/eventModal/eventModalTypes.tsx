import type { FormEvent, ChangeEvent, ReactNode } from "react";
import type { Event } from "../../../../db/scheduleDb";

export interface BaseFormProps {
  eventData: Event;
  isShaking?: boolean;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
}

export interface BaseEventModalProps extends BaseFormProps {
  title: string;
  children: ReactNode;
}

export interface EventModalProps extends BaseFormProps {
  onRequestDelete?: () => void | Promise<void>;
  onEditSingle?: () => void;
  onEditAll?: () => void;
}

export interface IEventModalStrategy {
  canSupport: (eventData: Event) => boolean;
  render: (commonProps: EventModalProps) => ReactNode;
}

import type { FormEvent, ChangeEvent } from "react";
import type { Event } from "../../../../db/scheduleDb";

export interface EventModalProps {
  eventData: Event;
  isShaking?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  onRequestDelete: () => void | Promise<void>;
}

import type { FormEvent, ChangeEvent } from "react";
import type { Event } from "../../../../db/scheduleDb";
import { BaseEventModal } from "./eventModal";

interface AddEventModalProps {
  eventData: Event;
  isShaking?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
}

export function AddEventModal({
  eventData,
  isShaking,
  onChange,
  onClose,
  onSubmit,
}: AddEventModalProps) {
  return (
    <BaseEventModal
      title="Dodaj wydarzenie"
      eventData={eventData}
      isShaking={isShaking}
      onChange={onChange}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        Anuluj
      </button>
      <button type="submit" className="btn btn-primary">
        Dodaj
      </button>
    </BaseEventModal>
  );
}

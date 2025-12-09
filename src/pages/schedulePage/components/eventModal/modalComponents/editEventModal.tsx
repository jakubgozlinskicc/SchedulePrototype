import type { FormEvent, ChangeEvent } from "react";
import type { Event } from "../../../../../db/scheduleDb";
import { BaseEventModal } from "./baseEventModal";

interface EditEventModalProps {
  eventData: Event;
  isShaking?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  onRequestDelete: () => void | Promise<void>;
}

export function EditEventModal({
  eventData,
  isShaking,
  onChange,
  onClose,
  onSubmit,
  onRequestDelete,
}: EditEventModalProps) {
  return (
    <BaseEventModal
      title="Edytuj wydarzenie"
      eventData={eventData}
      isShaking={isShaking}
      onChange={onChange}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <button
        type="button"
        className="btn btn-delete"
        onClick={onRequestDelete}
      >
        Usuń
      </button>
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        Anuluj
      </button>
      <button type="submit" className="btn btn-primary">
        Zapisz zmiany
      </button>
    </BaseEventModal>
  );
}

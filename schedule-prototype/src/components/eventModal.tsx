import type { FormEvent, ChangeEvent } from "react";
import type { Event } from "../db/scheduleDb";
import "./eventModal.css";

type EventData = Omit<Event, "id">;

interface EventModalProps {
  isOpen: boolean;
  editingEventId: number | null;
  eventData: EventData;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
}

function toDateTimeLocal(date: Date) {
  if (!date) return "";
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export function EventModal({
  isOpen,
  editingEventId,
  eventData,
  onChange,
  onClose,
  onSubmit,
}: EventModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3 className="modal-title">
          {editingEventId === null ? "Dodaj wydarzenie" : "Edytuj wydarzenie"}
        </h3>

        <form onSubmit={onSubmit} className="modal-form">
          <div className="form-field">
            <label className="form-label">Tytuł</label>
            <input
              type="text"
              name="title"
              value={eventData.title}
              onChange={onChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-field">
            <label className="form-label">Opis</label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={onChange}
              className="form-textarea"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Początek</label>
            <input
              type="datetime-local"
              name="start"
              value={toDateTimeLocal(eventData.start)}
              onChange={onChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-field">
            <label className="form-label">Koniec</label>
            <input
              type="datetime-local"
              name="end"
              value={toDateTimeLocal(eventData.end)}
              onChange={onChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Kolor</label>
            <input
              type="color"
              name="color"
              value={eventData.color}
              onChange={onChange}
              className="color-input"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Anuluj
            </button>
            <button type="submit" className="btn btn-primary">
              {editingEventId === null ? "Dodaj" : "Zapisz zmiany"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

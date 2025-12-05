import type { FormEvent, ChangeEvent } from "react";
import type { Event } from "../db/scheduleDb";
import { toDateTimeLocal } from "../utils/toDateTimeLocal";
import "./eventModal.css";

type EventData = Omit<Event, "id">;

interface EventModalProps {
  isOpen: boolean;
  editingEventId: number | null;
  isEditingMode: boolean;
  eventData: EventData;
  isShaking?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  onRequestEdit: () => void;
  onRequestDelete: () => void | Promise<void>;
}

export function EventModal({
  isOpen,
  editingEventId,
  isEditingMode,
  eventData,
  isShaking,
  onChange,
  onClose,
  onSubmit,
  onRequestEdit,
  onRequestDelete,
}: EventModalProps) {
  if (!isOpen) return null;

  const isViewMode = editingEventId !== null && !isEditingMode;

  const isAddMode = editingEventId === null && isEditingMode;

  if (isViewMode) {
    return (
      <div className="modal-backdrop">
        <div className={`modal ${isShaking ? "shake" : ""}`}>
          <h3 className="modal-title">Szczegóły wydarzenia</h3>

          <div className="view-field">
            <span className="view-label">Tytuł: </span>
            <span className="view-value">{eventData.title}</span>
          </div>

          <div className="view-field">
            <span className="view-label">Początek: </span>
            <span className="view-value">
              {eventData.start.toLocaleString()}
            </span>
          </div>

          <div className="view-field">
            <span className="view-label">Koniec: </span>
            <span className="view-value">{eventData.end.toLocaleString()}</span>
          </div>

          <div className="view-field">
            <span className="view-label">Opis: </span>
            <span className="view-value">
              {eventData.description || "Brak opisu"}
            </span>
          </div>

          <div className="view-field">
            <span className="view-label">Kolor: </span>
            <span className="view-value">
              <span
                className="event-color-dot"
                style={{ backgroundColor: eventData.color }}
              />
            </span>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-delete"
              onClick={onRequestDelete}
              disabled={!editingEventId}
            >
              Usuń
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onRequestEdit}
              disabled={!editingEventId}
            >
              Edytuj
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Zamknij
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop">
      <div className={`modal ${isShaking ? "shake" : ""}`}>
        <h3 className="modal-title">
          {isAddMode ? "Dodaj wydarzenie" : "Edytuj wydarzenie"}
        </h3>

        <form onSubmit={onSubmit} className="modal-form">
          <div className="form-field">
            <label className="form-label">Tytuł</label>
            <input
              id="title"
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
              className="btn btn-secondary"
              onClick={onClose}
            >
              Anuluj
            </button>
            <button type="submit" className="btn btn-primary">
              {isAddMode ? "Dodaj" : "Zapisz zmiany"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

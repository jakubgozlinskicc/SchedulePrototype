import type { FormEvent, ChangeEvent, ReactNode } from "react";
import type { Event } from "../../db/scheduleDb";
import { toDateTimeLocal } from "../../utils/toDateTimeLocal";
import { AddEventModal } from "./AddEventModal";
import { EditEventModal } from "./EditEventModal";
import { eventModalStrategyRegistry } from "./modalRegistry";
import "./eventModal.css";

interface EventModalProps {
  eventData: Event;
  isShaking?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  onRequestDelete: () => void | Promise<void>;
}

export function BaseEventModal({
  title,
  eventData,
  isShaking,
  onChange,
  onSubmit,
  children,
}: {
  title: string;
  eventData: Event;
  isShaking?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  children: ReactNode;
}) {
  return (
    <div className="modal-backdrop">
      <div className={`modal ${isShaking ? "shake" : ""}`}>
        <h3 className="modal-title">{title}</h3>

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

          <div className="modal-actions">{children}</div>
        </form>
      </div>
    </div>
  );
}

export function EventModal({
  eventData,
  isShaking,
  onChange,
  onClose,
  onSubmit,
  onRequestDelete,
}: EventModalProps) {
  const modalType = eventModalStrategyRegistry.getTypeByEvent(eventData);

  const commonProps = {
    eventData,
    isShaking,
    onChange,
    onClose,
    onSubmit,
    onRequestDelete,
  };

  switch (modalType) {
    case "ADD":
      return <AddEventModal {...commonProps} />;

    case "EDIT":
      return <EditEventModal {...commonProps} />;
  }
}

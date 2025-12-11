import type { Event } from "../../../../../db/scheduleDb";
import { toDateTimeLocal } from "../../../../../utils/toDateTimeLocal/toDateTimeLocal";
import type { FormEvent, ChangeEvent, ReactNode } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  return (
    <div className="modal-backdrop">
      <div className={`modal ${isShaking ? "shake" : ""}`}>
        <h3 className="modal-title">{title}</h3>

        <form onSubmit={onSubmit} className="modal-form">
          <div className="form-field">
            <label className="form-label">{t("title")}</label>
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
            <label id="desctription" className="form-label">
              {t("description")}
            </label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={onChange}
              className="form-textarea"
            />
          </div>

          <div className="form-field">
            <label id="start-date" className="form-label">
              {t("start-date")}
            </label>
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
            <label id="end-date" className="form-label">
              {t("end-date")}
            </label>
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
            <label id="color" className="form-label">
              {t("color")}
            </label>
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

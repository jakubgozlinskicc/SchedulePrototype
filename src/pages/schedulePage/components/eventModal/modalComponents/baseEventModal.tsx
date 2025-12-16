import type { BaseEventModalProps } from "../eventModalTypes";
import { toDateTimeLocal } from "../../../../../utils/toDateTimeLocal/toDateTimeLocal";
import { useTranslation } from "react-i18next";
import { RecurrenceFields } from "./recurrenceFields/recurrenceFields";

export function BaseEventModal({
  title,
  eventData,
  isShaking,
  onChange,
  onSubmit,
  children,
}: BaseEventModalProps) {
  const { t } = useTranslation();

  const recurrenceType = eventData.recurrenceRule?.type ?? "none";

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
            <label id="description" className="form-label">
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

          <div className="form-field">
            <label id="recurrence-type" className="form-label">
              {t("recurrence-type")}
            </label>
            <select
              name="recurrenceType"
              value={recurrenceType}
              onChange={onChange}
              className="form-input"
            >
              <option value="none">{t("recurrence-none")}</option>
              <option value="daily">{t("recurrence-daily")}</option>
              <option value="weekly">{t("recurrence-weekly")}</option>
              <option value="monthly">{t("recurrence-monthly")}</option>
              <option value="yearly">{t("recurrence-yearly")}</option>
            </select>
          </div>

          <RecurrenceFields
            recurrenceRule={eventData.recurrenceRule}
            onChange={onChange}
          />

          <div className="modal-actions">{children}</div>
        </form>
      </div>
    </div>
  );
}

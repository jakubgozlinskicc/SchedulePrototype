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
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  children: ReactNode;
}) {
  const { t } = useTranslation();

  const recurrenceType = eventData.recurrenceRule?.type ?? "none";
  const recurrenceInterval = eventData.recurrenceRule?.interval ?? 1;
  const recurrenceEndDate = eventData.recurrenceRule?.endDate;
  const recurrenceCount = eventData.recurrenceRule?.count;

  const endType = recurrenceEndDate
    ? "date"
    : recurrenceCount
    ? "count"
    : "never";

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

          {recurrenceType !== "none" && (
            <>
              <div className="form-field">
                <label id="recurrence-interval" className="form-label">
                  {t("recurrence-interval")}{" "}
                  {recurrenceType === "daily"
                    ? t("recurrence-interval-daily-unit")
                    : recurrenceType === "weekly"
                    ? t("recurrence-interval-weekly-unit")
                    : recurrenceType === "monthly"
                    ? t("recurrence-interval-monthly-unit")
                    : t("recurrence-interval-yearly-unit")}
                </label>
                <input
                  type="number"
                  name="recurrenceInterval"
                  value={recurrenceInterval}
                  onChange={onChange}
                  className="form-input"
                  min="1"
                  max="100"
                />
              </div>

              <div className="form-field">
                <label id="recurrence-end-type" className="form-label">
                  {t("recurrence-end-type")}
                </label>
                <select
                  name="recurrenceEndType"
                  value={endType}
                  onChange={onChange}
                  className="form-input"
                >
                  <option value="never">{t("recurrence-end-never")}</option>
                  <option value="date">{t("recurrence-end-date")}</option>
                  <option value="count">{t("recurrence-end-count")}</option>
                </select>
              </div>

              {endType === "date" && (
                <div className="form-field">
                  <label id="recurrence-end-date" className="form-label">
                    {t("recurrence-end-date-label")}
                  </label>
                  <input
                    type="date"
                    name="recurrenceEndDate"
                    value={
                      recurrenceEndDate
                        ? toDateTimeLocal(recurrenceEndDate)
                        : ""
                    }
                    onChange={onChange}
                    className="form-input"
                  />
                </div>
              )}

              {endType === "count" && (
                <div className="form-field">
                  <label id="recurrence-count" className="form-label">
                    {t("recurrence-count-label")}
                  </label>
                  <input
                    type="number"
                    name="recurrenceCount"
                    value={recurrenceCount ?? 10}
                    onChange={onChange}
                    className="form-input"
                    min="1"
                    max="365"
                  />
                </div>
              )}
            </>
          )}

          <div className="modal-actions">{children}</div>
        </form>
      </div>
    </div>
  );
}

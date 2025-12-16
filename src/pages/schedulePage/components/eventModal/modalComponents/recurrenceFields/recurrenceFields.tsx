import type { RecurrenceFieldsProps } from "./recurrenceFieldsTypes";
import { useTranslation } from "react-i18next";
import { useRecurrenceField } from "./useRecurrenceFields";
export function RecurrenceFields({
  recurrenceRule,
  onChange,
}: RecurrenceFieldsProps) {
  const { t } = useTranslation();
  const {
    recurrenceType,
    recurrenceInterval,
    recurrenceEndDate,
    recurrenceCount,
    endType,
    EndTypeComponent,
  } = useRecurrenceField({ recurrenceRule });
  if (recurrenceType === "none") {
    return null;
  }
  return (
    <>
      <div className="form-field">
        <label id="recurrence-interval" className="form-label">
          {t("recurrence-interval")}{" "}
          {t(`recurrence-interval-${recurrenceType}-unit`)}
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
      {EndTypeComponent && (
        <EndTypeComponent
          onChange={onChange}
          recurrenceEndDate={recurrenceEndDate}
          recurrenceCount={recurrenceCount}
        />
      )}
    </>
  );
}

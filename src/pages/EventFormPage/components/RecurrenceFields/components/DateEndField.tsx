import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { EventFormData } from "../../EventForm/eventFormSchema";

export function DateEndField() {
  const { t } = useTranslation();
  const { register } = useFormContext<EventFormData>();

  return (
    <div className="event-form-field">
      <label htmlFor="recurrenceEndDate" className="event-form-label">
        {t("recurrence-end-date-label")}
      </label>
      <input
        id="recurrenceEndDate"
        type="date"
        {...register("recurrenceEndDate")}
        className="event-form-input"
      />
    </div>
  );
}

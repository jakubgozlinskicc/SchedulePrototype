import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { EventFormData } from "../../EventForm/eventFormSchema";

export function CountEndField() {
  const { t } = useTranslation();
  const { register } = useFormContext<EventFormData>();

  return (
    <div className="event-form-field">
      <label htmlFor="recurrenceCount" className="event-form-label">
        {t("recurrence-count-label")}
      </label>
      <input
        id="recurrenceCount"
        type="number"
        {...register("recurrenceCount", { valueAsNumber: true })}
        className="event-form-input"
        min={1}
        max={365}
      />
    </div>
  );
}

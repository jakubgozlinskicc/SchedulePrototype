import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { EventFormData } from "../EventForm/eventFormSchema";
import type { EndType } from "./RecurrenceFieldsTypes";
import { EndTypeStrategyRegistry } from "./endTypeStrategies/endTypeStrategyRegistry";

interface RecurrenceFieldsProps {
  recurrenceEndType: EndType;
}

export function RecurrenceFields({ recurrenceEndType }: RecurrenceFieldsProps) {
  const { t } = useTranslation();
  const { register } = useFormContext<EventFormData>();

  const strategy = EndTypeStrategyRegistry.provideConfig(recurrenceEndType);
  const EndTypeComponent = strategy.getComponent();

  return (
    <div className="recurrence-fields">
      <div className="event-form-field">
        <label className="event-form-label">{t("recurrence-end-type")}</label>
        <select {...register("recurrenceEndType")} className="event-form-input">
          <option value="never">{t("recurrence-end-never")}</option>
          <option value="date">{t("recurrence-end-date")}</option>
          <option value="count">{t("recurrence-end-count")}</option>
        </select>
      </div>

      {/* eslint-disable-next-line react-hooks/static-components */}
      {EndTypeComponent && <EndTypeComponent />}
    </div>
  );
}

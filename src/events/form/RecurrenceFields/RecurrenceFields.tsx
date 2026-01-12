import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { EventFormData } from "../EventForm/eventFormSchema";
import type { EndType } from "./recurrenceFieldsTypes";
import { EndTypeStrategyRegistry } from "./endTypeStrategies/endTypeStrategyRegistry";
import { FormField } from "../../../components/Form/FormField/FormField";
import { FormLabel } from "../../../components/Form/FormLabel/FormLabel";
import { FormInput } from "../../../components/Form/FormInput/FormInput";
import { FormSelect } from "../../../components/Form/FormSelect/FormSelect";

interface RecurrenceFieldsProps {
  recurrenceEndType: EndType;
}

export function RecurrenceFields({ recurrenceEndType }: RecurrenceFieldsProps) {
  const { t } = useTranslation();

  const recurrenceType = useWatch<EventFormData, "recurrenceType">({
    name: "recurrenceType",
  });

  const strategy = EndTypeStrategyRegistry.provideConfig(recurrenceEndType);
  const EndTypeComponent = strategy.getComponent();

  const intervalUnitKey = `recurrence-interval-${recurrenceType}-unit`;

  return (
    <div className="recurrence-fields">
      <FormField>
        <FormLabel>
          <i className="fa-solid fa-arrows-left-right"></i>
          {t("recurrence-interval")} {t(intervalUnitKey)}
        </FormLabel>
        <FormInput name="recurrenceInterval" type="number" min={1} max={100} />
      </FormField>

      <FormField>
        <FormLabel>
          <i className="fa-solid fa-flag-checkered"></i>
          {t("recurrence-end-type")}
        </FormLabel>
        <FormSelect
          name="recurrenceEndType"
          options={[
            { value: "never", label: t("recurrence-end-never") },
            { value: "date", label: t("recurrence-end-date") },
            { value: "count", label: t("recurrence-end-count") },
          ]}
        />
      </FormField>

      {/* eslint-disable-next-line react-hooks/static-components */}
      {EndTypeComponent && <EndTypeComponent />}
    </div>
  );
}

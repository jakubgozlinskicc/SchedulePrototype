import { useTranslation } from "react-i18next";
import { FormTextArea } from "../../../components/Form/FormTextArea/FormTextArea";
import { FormInput } from "../../../components/Form/FormInput/FormInput";
import { FormLabel } from "../../../components/Form/FormLabel/FormLabel";
import { FormSelect } from "../../../components/Form/FormSelect/FormSelect";
import { FormField } from "../../../components/Form/FormField/FormField";
import { RecurrenceFields } from "../RecurrenceFields/RecurrenceFields";
import { useWatch } from "react-hook-form";

export function EventFormFields() {
  const { t } = useTranslation();

  const recurrenceType = useWatch({ name: "recurrenceType" });
  const recurrenceEndType = useWatch({ name: "recurrenceEndType" });

  return (
    <>
      <FormField>
        <FormLabel>
          <i className="fa-solid fa-pen-to-square"></i>
          {t("title")}
        </FormLabel>
        <FormInput name="title" type="text" />
      </FormField>

      <FormField>
        <FormLabel>
          <i className="fa-solid fa-bars-staggered"></i>
          {t("description")}
        </FormLabel>
        <FormTextArea name="description" />
      </FormField>

      <FormField>
        <FormLabel>
          <i className="fa-solid fa-hourglass-start"></i>
          {t("start-date")}
        </FormLabel>
        <FormInput name="start" type="datetime-local" />
      </FormField>

      <FormField>
        <FormLabel>
          <i className="fa-solid fa-hourglass-end"></i>
          {t("end-date")}
        </FormLabel>
        <FormInput name="end" type="datetime-local" />
      </FormField>

      <FormField>
        <FormLabel>
          <i className="fa-solid fa-palette"></i>
          {t("color")}
        </FormLabel>
        <FormInput
          name="color"
          type="color"
          className="event-form-color-picker"
        />
      </FormField>

      <FormField>
        <FormLabel>
          <i className="fa-solid fa-repeat"></i>
          {t("recurrence-type")}
        </FormLabel>
        <FormSelect
          name="recurrenceType"
          options={[
            { value: "none", label: t("recurrence-none") },
            { value: "daily", label: t("recurrence-daily") },
            { value: "weekly", label: t("recurrence-weekly") },
            { value: "monthly", label: t("recurrence-monthly") },
            { value: "yearly", label: t("recurrence-yearly") },
          ]}
        />
      </FormField>

      {recurrenceType !== "none" && (
        <RecurrenceFields recurrenceEndType={recurrenceEndType} />
      )}
    </>
  );
}

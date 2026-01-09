import { useTranslation } from "react-i18next";
import { FormField } from "../../../../components/Form/FormField/FormField";
import { FormLabel } from "../../../../components/Form/FormLabel/FormLabel";
import { FormInput } from "../../../../components/Form/FormInput/FormInput";

export function DateEndField() {
  const { t } = useTranslation();

  return (
    <FormField>
      <FormLabel htmlFor="recurrenceEndDate">
        {t("recurrence-end-date-label")}
      </FormLabel>
      <FormInput id="recurrenceEndDate" name="recurrenceEndDate" type="date" />
    </FormField>
  );
}

import { useTranslation } from "react-i18next";
import { FormField } from "../../../../components/Form/FormField/FormField";
import { FormLabel } from "../../../../components/Form/FormLabel/FormLabel";
import { FormDatePicker } from "../../../../components/Form/FormDatePicker/FormDatePicker";

export function DateEndField() {
  const { t } = useTranslation();

  return (
    <FormField>
      <FormLabel htmlFor="recurrenceEndDate">
        {t("recurrence-end-date-label")}
      </FormLabel>
      <FormDatePicker
        name="recurrenceEndDate"
        variant="date"
        placeholderText={t("select-end-date")}
      />
    </FormField>
  );
}

import { useTranslation } from "react-i18next";
import { FormField } from "../../../../components/Form/FormField/FormField";
import { FormLabel } from "../../../../components/Form/FormLabel/FormLabel";
import { FormInput } from "../../../../components/Form/FormInput/FormInput";

export function CountEndField() {
  const { t } = useTranslation();

  return (
    <FormField>
      <FormLabel htmlFor="recurrenceCount">
        {t("recurrence-count-label")}
      </FormLabel>
      <FormInput
        id="recurrenceCount"
        name="recurrenceCount"
        type="number"
        min={1}
        max={365}
      />
    </FormField>
  );
}

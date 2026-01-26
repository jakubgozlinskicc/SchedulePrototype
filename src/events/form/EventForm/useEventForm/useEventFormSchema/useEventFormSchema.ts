import { useTranslation } from "react-i18next";
import { createEventFormSchema } from "../../eventFormSchema";

export function useEventFormSchema() {
  const { t } = useTranslation();

  return { eventFormSchema: createEventFormSchema(t) };
}

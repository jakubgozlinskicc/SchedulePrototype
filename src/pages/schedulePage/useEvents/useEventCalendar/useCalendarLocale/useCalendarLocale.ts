import { useTranslationContext } from "../../../../../locales/useTranslationContext";
import {
  locales,
  createLocalizer,
} from "../../../../../utils/calendarLocalizer/calendarLocalizer";
import { createFormats } from "../../../../../utils/dateFormats/dateFormats";

export const useCalendarLocale = () => {
  const { currentLanguage } = useTranslationContext();

  const locale = locales[currentLanguage];

  const localizer = createLocalizer(locale);

  const formats = createFormats(locale);

  return { localizer, formats };
};

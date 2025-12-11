import { useMemo } from "react";
import { useTranslationContext } from "../../../../../locales/useTranslationContext";
import {
  locales,
  createLocalizer,
} from "../../../../../utils/calendarLocalizer";
import { createFormats } from "../../../../../utils/dateFormats";

export const useCalendarLocale = () => {
  const { currentLanguage } = useTranslationContext();

  const locale = locales[currentLanguage];

  const localizer = useMemo(() => createLocalizer(locale), [locale]);

  const formats = useMemo(() => createFormats(locale), [locale]);

  return { localizer, formats };
};

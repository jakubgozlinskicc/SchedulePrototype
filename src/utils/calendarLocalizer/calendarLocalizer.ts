import { dateFnsLocalizer } from "react-big-calendar";
import { format, startOfWeek, getDay, type Locale } from "date-fns";
import { pl, enUS } from "date-fns/locale";

export const locales = {
  pl,
  enUS,
};
const formatDate = (date: Date, formatStr: string, locale: Locale): string => {
  const options = { locale };
  if (formatStr === "p" || formatStr === "h:mma") {
    return format(date, "HH:mm", options);
  }

  return format(date, formatStr, options);
};

export const createLocalizer = (currentLocale: Locale) =>
  dateFnsLocalizer({
    format: (date: Date, formatStr: string) =>
      formatDate(date, formatStr, currentLocale),
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
  });

import { dateFnsLocalizer } from "react-big-calendar";
import { format, startOfWeek, getDay } from "date-fns";
import { pl } from "date-fns/locale";

const locales = {
  pl,
};

const formatDate = (date: Date, formatStr: string): string => {
  const options = { locale: pl };
  if (formatStr === "p" || formatStr === "h:mma") {
    return format(date, "HH:mm", options);
  }

  return format(date, formatStr, options);
};

export const localizer = dateFnsLocalizer({
  format: formatDate,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

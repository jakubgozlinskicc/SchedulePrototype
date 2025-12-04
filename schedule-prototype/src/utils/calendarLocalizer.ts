import { dateFnsLocalizer } from "react-big-calendar";
import { format as dfFormat, startOfWeek, getDay } from "date-fns";
import { pl } from "date-fns/locale";

const locales = {
  pl,
};

const formatDate = (date: Date, formatStr: string): string => {
  if (formatStr === "p" || formatStr === "h:mma") {
    return dfFormat(date, "HH:mm");
  }
  return dfFormat(date, formatStr);
};

export const localizer = dateFnsLocalizer({
  format: formatDate,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

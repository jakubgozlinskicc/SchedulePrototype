import type { Formats } from "react-big-calendar";
import { format, type Locale } from "date-fns";

export const createFormats = (locale: Locale): Formats => ({
  dayRangeHeaderFormat: ({ start, end }) => {
    const startDay = format(start, "dd", { locale });
    const endDay = format(end, "dd", { locale });
    const month = format(start, "LLLL", { locale });

    return `${startDay}-${endDay} ${month}`;
  },
  monthHeaderFormat: (date) => {
    return format(date, "LLLL yyyy", { locale });
  },
  dayHeaderFormat: (date) => format(date, "dd MMMM eeee", { locale }),
});

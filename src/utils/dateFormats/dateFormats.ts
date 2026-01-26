import type { Formats } from "react-big-calendar";
import { format, type Locale } from "date-fns";

export const createFormats = (locale: Locale): Formats => ({
  dayRangeHeaderFormat: ({ start, end }) => {
    const rangeStart = format(start, "dd LLLL yyyy", { locale });
    const rangeEnd = format(end, "dd LLLL yyyy", { locale });

    return `${rangeStart} - ${rangeEnd}  `;
  },
  monthHeaderFormat: (date) => {
    return format(date, "LLLL yyyy", { locale });
  },
  dayHeaderFormat: (date) => format(date, "dd MMMM yyyy eeee", { locale }),
});

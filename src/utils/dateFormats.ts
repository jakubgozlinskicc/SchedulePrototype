import type { Formats } from "react-big-calendar";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

export const formats: Formats = {
  dayRangeHeaderFormat: ({ start, end }) => {
    const startDay = format(start, "dd", { locale: pl });
    const endDay = format(end, "dd", { locale: pl });
    const month = format(start, "LLLL", { locale: pl });

    return `${startDay}-${endDay} ${month}`;
  },
  monthHeaderFormat: (date) => {
    return format(date, "LLLL yyyy", { locale: pl });
  },
  dayHeaderFormat: (date) => format(date, "dd MMMM eeee", { locale: pl }),
};

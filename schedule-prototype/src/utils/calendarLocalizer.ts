import { dateFnsLocalizer } from "react-big-calendar";
import { parse, format, startOfWeek, getDay } from "date-fns";
import { pl } from "date-fns/locale";

const locales = {
  pl: pl,
};

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "../../../../../../locales/useTranslationContext";
import { locales } from "../../../../../../utils/calendarLocalizer/calendarLocalizer";
import type { Event } from "../../../../../../db/scheduleDb";
import { resetTime } from "../useFilteredEvents/resetTime";

interface GroupedEvents {
  dateKey: string;
  dateLabel: string;
  events: Event[];
}

export function useGroupedEvents(events: Event[]) {
  const { t } = useTranslation();
  const { currentLanguage } = useTranslationContext();
  const locale = locales[currentLanguage];

  const formatDayHeader = (date: Date): string => {
    const today = resetTime(new Date());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const eventDay = resetTime(new Date(date)).getTime();

    if (eventDay === today.getTime()) return t("today");
    if (eventDay === tomorrow.getTime()) return t("tomorrow");

    return format(new Date(date), "EEEE, d MMMM yyyy", { locale });
  };

  const formatTime = (date: Date) =>
    format(new Date(date), "HH:mm", { locale });

  const grouped = events.reduce<GroupedEvents[]>((groups, event) => {
    const dateKey = new Date(event.start).toISOString().split("T")[0];
    const existing = groups.find((g) => g.dateKey === dateKey);

    if (existing) {
      existing.events.push(event);
    } else {
      groups.push({
        dateKey,
        dateLabel: formatDayHeader(event.start),
        events: [event],
      });
    }

    return groups;
  }, []);

  return { groupedEvents: grouped, formatTime };
}

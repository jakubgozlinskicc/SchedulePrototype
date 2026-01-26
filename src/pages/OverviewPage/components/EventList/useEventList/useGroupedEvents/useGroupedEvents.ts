import { format, startOfDay, addDays, differenceInDays } from "date-fns";
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

  const getEventDays = (start: Date, end: Date) => {
    const startDay = startOfDay(new Date(start));
    const endDay = startOfDay(new Date(end));
    const daysDiff = differenceInDays(endDay, startDay);
    return { startDay, endDay, daysDiff };
  };

  const formatDayHeader = (date: Date): string => {
    const today = resetTime(new Date());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const eventDay = resetTime(new Date(date)).getTime();

    if (eventDay === today.getTime()) return t("today");
    if (eventDay === tomorrow.getTime()) return t("tomorrow");

    return format(new Date(date), "EEEE, d MMMM yyyy", { locale });
  };

  const formatTime = (start: Date, end: Date) => {
    const { daysDiff } = getEventDays(start, end);
    const isMultiDay = daysDiff > 0;
    if (isMultiDay) {
      return `${format(new Date(start), "d MMM, HH:mm", { locale })} — ${format(new Date(end), "d MMM, HH:mm", { locale })}`;
    }
    return `${format(new Date(start), "HH:mm", { locale })} — ${format(new Date(end), "HH:mm", { locale })}`;
  };

  const expandedEvents = events.flatMap((event) => {
    const { startDay, daysDiff } = getEventDays(event.start, event.end);
    if (daysDiff === 0) {
      return [{ event, displayDate: startDay }];
    }
    const days = [];
    for (let i = 0; i <= daysDiff; i++) {
      days.push({
        event,
        displayDate: addDays(startDay, i),
      });
    }
    return days;
  });

  const grouped = expandedEvents.reduce<GroupedEvents[]>(
    (groups, { event, displayDate }) => {
      const dateKey = format(displayDate, "yyyy-MM-dd");
      const existing = groups.find((g) => g.dateKey === dateKey);

      if (existing) {
        const isDuplicate = existing.events.some(
          (e) =>
            (e.id && e.id === event.id) ||
            (e.recurringEventId &&
              e.recurringEventId === event.recurringEventId &&
              e.start.getTime() === event.start.getTime()),
        );
        if (!isDuplicate) {
          existing.events.push(event);
        }
      } else {
        groups.push({
          dateKey,
          dateLabel: formatDayHeader(displayDate),
          events: [event],
        });
      }

      return groups;
    },
    [],
  );

  return { groupedEvents: grouped, formatTime };
}

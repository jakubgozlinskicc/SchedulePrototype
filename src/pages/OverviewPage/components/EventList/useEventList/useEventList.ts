import { useEventDataContext } from "../../../../../events/useEvents/useEventDataContext/useEventDataContext";
import { useTranslationContext } from "../../../../../locales/useTranslationContext";
import { locales } from "../../../../../utils/calendarLocalizer/calendarLocalizer";
import type { Event } from "../../../../../db/scheduleDb";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { useFiltersContext } from "../../../context/useFiltersContext";

interface GroupedEvents {
  dateKey: string;
  dateLabel: string;
  events: Event[];
}

export function useEventList() {
  const { events } = useEventDataContext();
  const { currentLanguage } = useTranslationContext();
  const { filters } = useFiltersContext();
  const { t } = useTranslation();

  const locale = locales[currentLanguage];

  const resetTime = (d: Date) => {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy;
  };

  const formatTime = (date: Date) =>
    format(new Date(date), "HH:mm", { locale });

  const formatDayHeader = (date: Date): string => {
    const today = resetTime(new Date());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const eventDay = resetTime(new Date(date)).getTime();

    if (eventDay === today.getTime()) return t("today");
    if (eventDay === tomorrow.getTime()) return t("tomorrow");

    return format(new Date(date), "EEEE, d MMMM yyyy", { locale });
  };

  const applyFilters = (event: Event): boolean => {
    const eventDate = resetTime(new Date(event.start));

    if (filters.dateFrom && eventDate < resetTime(filters.dateFrom)) {
      return false;
    }

    if (filters.dateTo && eventDate > resetTime(filters.dateTo)) {
      return false;
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = event.title.toLowerCase().includes(query);
      const matchesDescription = event.description
        ?.toLowerCase()
        .includes(query);
      if (!matchesTitle && !matchesDescription) {
        return false;
      }
    }

    if (!filters.showPastEvents) {
      const now = resetTime(new Date());
      if (eventDate < now) {
        return false;
      }
    }

    return true;
  };

  const getGroupedEvents = (): GroupedEvents[] => {
    return [...events]
      .filter(applyFilters)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .reduce<GroupedEvents[]>((groups, event) => {
        const dateKey = new Date(event.start).toISOString().split("T")[0];
        const existingGroup = groups.find((g) => g.dateKey === dateKey);

        if (existingGroup) {
          existingGroup.events.push(event);
        } else {
          groups.push({
            dateKey,
            dateLabel: formatDayHeader(event.start),
            events: [event],
          });
        }

        return groups;
      }, []);
  };

  return {
    groupedEvents: getGroupedEvents(),
    formatTime,
  };
}

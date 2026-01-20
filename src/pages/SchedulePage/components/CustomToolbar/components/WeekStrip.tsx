import { format, startOfWeek, addDays, isSameDay, isToday } from "date-fns";
import type { NavigateAction } from "react-big-calendar";
import { useTranslationContext } from "../../../../../locales/useTranslationContext";
import { locales } from "../../../../../utils/calendarLocalizer/calendarLocalizer";
import { Button } from "../../../../../components/Button/Button";

type OnView = (view: "month" | "week" | "day") => void;

interface WeekStripProps {
  date: Date;
  onNavigate: (action: NavigateAction, newDate?: Date) => void;
  onView: OnView;
  view: "month" | "week" | "day";
}

export const WeekStrip = ({
  date,
  onNavigate,
  onView,
  view,
}: WeekStripProps) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const { currentLanguage } = useTranslationContext();
  const locale = locales[currentLanguage];

  return (
    <div className="week-strip">
      {days.map((day) => {
        const isDayToday = isToday(day);

        return (
          <Button
            key={day.toISOString()}
            variant="primary"
            isActive={isSameDay(day, date) && view === "day"}
            className={`week-strip-day ${isDayToday ? "is-today" : ""}`}
            onClick={() => {
              onView("day");
              onNavigate("DATE", day);
            }}
          >
            {format(day, "EEE dd", { locale })}
          </Button>
        );
      })}
    </div>
  );
};

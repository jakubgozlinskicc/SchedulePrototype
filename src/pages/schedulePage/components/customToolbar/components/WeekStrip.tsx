import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import type { NavigateAction } from "react-big-calendar";
import { useTranslationContext } from "../../../../../locales/useTranslationContext";
import { locales } from "../../../../../utils/calendarLocalizer/calendarLocalizer";

type OnView = (view: "month" | "week" | "day") => void;

interface WeekStripProps {
  date: Date;
  onNavigate: (action: NavigateAction, newDate?: Date) => void;
  onView: OnView;
}

export const WeekStrip = ({ date, onNavigate, onView }: WeekStripProps) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const { currentLanguage } = useTranslationContext();
  const locale = locales[currentLanguage];

  return (
    <div className="week-strip">
      {days.map((day) => (
        <button
          key={day.toISOString()}
          className={
            "week-strip-day" + (isSameDay(day, date) ? " active-day" : "")
          }
          onClick={() => {
            onView("day");
            onNavigate("DATE", day);
          }}
        >
          {format(day, "EEE dd", { locale })}
        </button>
      ))}
    </div>
  );
};

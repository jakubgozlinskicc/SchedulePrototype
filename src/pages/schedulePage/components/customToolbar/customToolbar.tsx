import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import type { ToolbarProps } from "react-big-calendar";
import type { Event } from "../../../../db/scheduleDb";
import "./customToolbar.css";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "../../../../locales/useTranslationContext";
import { locales } from "../../../../utils/calendarLocalizer/calendarLocalizer";

type CustomToolbarProps<
  TEvent extends object = Event,
  TResource extends object = object
> = ToolbarProps<TEvent, TResource> & {
  onAddEvent: () => void;
};

type WeekStripProps = {
  date: Date;
  onNavigate: CustomToolbarProps["onNavigate"];
  onView: CustomToolbarProps["onView"];
};

const WeekStrip = ({ date, onNavigate, onView }: WeekStripProps) => {
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

export const CustomToolbar = (props: CustomToolbarProps) => {
  const { label, date, view, onAddEvent, onNavigate, onView } = props;
  const { t } = useTranslation();

  return (
    <>
      <div className="custom-toolbar">
        <div className="actions-buttons">
          {onAddEvent && (
            <button className="nav-button" onClick={onAddEvent}>
              {t("btn-add")}
            </button>
          )}
          <button
            className="nav-button"
            onClick={() => props.onNavigate("TODAY")}
          >
            {t("today")}
          </button>
        </div>

        <div className="nav-buttons">
          <button
            className="nav-button"
            onClick={() => {
              props.onNavigate("PREV");
            }}
          >
            ←
          </button>

          <span className="toolbar-label">{label}</span>

          <button
            className="nav-button"
            onClick={() => props.onNavigate("NEXT")}
          >
            →
          </button>
        </div>

        <div className="view-buttons">
          <button className="view-button" onClick={() => props.onView("month")}>
            {t("month")}
          </button>
          <button className="view-button" onClick={() => props.onView("week")}>
            {t("week")}
          </button>
          <button className="view-button" onClick={() => props.onView("day")}>
            {t("day")}
          </button>
        </div>
      </div>

      {view === "day" && (
        <WeekStrip date={date} onNavigate={onNavigate} onView={onView} />
      )}
    </>
  );
};

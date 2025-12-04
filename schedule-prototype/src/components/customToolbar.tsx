import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { enGB } from "date-fns/locale";
import type { ToolbarProps } from "react-big-calendar";
import type { Event } from "../db/scheduleDb";
import "./customToolbar.css";

type CustomToolbarProps<
  TEvent extends object = Event,
  TResource extends object = object
> = ToolbarProps<TEvent, TResource> & {
  onAddEvent?: () => void;
};

export const CustomToolbar = (props: CustomToolbarProps) => {
  const { label, date, view, onAddEvent } = props;

  const renderWeekStrip = () => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

    return (
      <div className="week-strip">
        {days.map((day) => (
          <button
            key={day.toISOString()}
            className={
              "week-strip-day" + (isSameDay(day, date) ? " active-day" : "")
            }
            onClick={() => {
              props.onView("day");
              props.onNavigate("DATE", day);
            }}
          >
            {format(day, "EEE dd", { locale: enGB })}
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="custom-toolbar">
        <div className="actions-buttons">
          {onAddEvent && (
            <button className="nav-button" onClick={onAddEvent}>
              Dodaj wydarzenie
            </button>
          )}
          <button
            className="nav-button"
            onClick={() => props.onNavigate("TODAY")}
          >
            Dzisiaj
          </button>
        </div>

        <div className="nav-buttons">
          <button
            className="nav-button"
            onClick={() => {
              console.log("TODAY CLICK");
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
            Miesiąc
          </button>
          <button className="view-button" onClick={() => props.onView("week")}>
            Tydzień
          </button>
          <button className="view-button" onClick={() => props.onView("day")}>
            Dzień
          </button>
        </div>
      </div>

      {view === "day" && renderWeekStrip()}
    </>
  );
};

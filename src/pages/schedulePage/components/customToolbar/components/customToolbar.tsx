import type { ToolbarProps } from "react-big-calendar";
import type { Event } from "../../../../../db/scheduleDb";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "../../../../../locales/useTranslationContext";
import { locales } from "../../../../../utils/calendarLocalizer/calendarLocalizer";
import { useDatePicker } from "../useCustomToolbar/useDatePicker/useDatePicker";
import { DatePickerDropdown } from "./DatePickerDropdown";
import { WeekStrip } from "./WeekStrip";
import "./customToolbar.css";
import "./datePickerDropdown.css";
import "./weekStrip.css";

type CustomToolbarProps<
  TEvent extends object = Event,
  TResource extends object = object
> = ToolbarProps<TEvent, TResource> & {
  onAddEvent: () => void;
};

export const CustomToolbar = (props: CustomToolbarProps) => {
  const { label, date, view, onAddEvent, onNavigate, onView } = props;
  const { t } = useTranslation();
  const { currentLanguage } = useTranslationContext();
  const locale = locales[currentLanguage];

  const {
    isDatePickerOpen,
    datePickerRef,
    config,
    handleDateChange,
    toggleDatePicker,
  } = useDatePicker({ onNavigate, view });

  return (
    <>
      <div className="custom-toolbar">
        <div className="actions-buttons">
          {onAddEvent && (
            <button className="nav-button" onClick={onAddEvent}>
              {t("btn-add")}
            </button>
          )}
          <button className="nav-button" onClick={() => onNavigate("TODAY")}>
            {t("today")}
          </button>
        </div>

        <div className="nav-buttons">
          <button className="nav-button" onClick={() => onNavigate("PREV")}>
            ←
          </button>

          <div className="date-picker-container" ref={datePickerRef}>
            <button
              className="toolbar-label-button"
              onClick={toggleDatePicker}
              aria-expanded={isDatePickerOpen}
              aria-haspopup="dialog"
            >
              <span className="toolbar-label">{label}</span>
              <span className="calendar-icon">📅</span>
            </button>

            <DatePickerDropdown
              isOpen={isDatePickerOpen}
              selected={date}
              locale={locale}
              config={config}
              onChange={handleDateChange}
            />
          </div>

          <button className="nav-button" onClick={() => onNavigate("NEXT")}>
            →
          </button>
        </div>

        <div className="view-buttons">
          <button className="view-button" onClick={() => onView("month")}>
            {t("month")}
          </button>
          <button className="view-button" onClick={() => onView("week")}>
            {t("week")}
          </button>
          <button className="view-button" onClick={() => onView("day")}>
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

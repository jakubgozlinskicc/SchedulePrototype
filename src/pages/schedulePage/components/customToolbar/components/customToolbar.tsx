import type { ToolbarProps } from "react-big-calendar";
import type { Event } from "../../../../../db/scheduleDb";
import { useTranslation } from "react-i18next";
import { useTranslationContext } from "../../../../../locales/useTranslationContext";
import { locales } from "../../../../../utils/calendarLocalizer/calendarLocalizer";
import { useDatePicker } from "../useCustomToolbar/useDatePicker/useDatePicker";
import { WeekStrip } from "./WeekStrip";
import "./CustomToolbar.css";
import "./DatePickerDropdown.css";
import "./WeekStrip.css";
import { Button } from "../../../../../components/Button/Button";

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
    handleDateChange,
    toggleDatePicker,
    DatePickerComponent,
  } = useDatePicker({ onNavigate, view });

  return (
    <>
      <div className="custom-toolbar">
        <div className="actions-buttons">
          {onAddEvent && (
            <Button variant="primary" onClick={onAddEvent}>
              {t("btn-add")} <i className="fa-solid fa-calendar-plus"></i>
            </Button>
          )}
          <Button variant="primary" onClick={() => onNavigate("TODAY")}>
            {t("today")}
          </Button>
        </div>

        <div className="nav-buttons">
          <Button variant="primary" onClick={() => onNavigate("PREV")}>
            <i className="fa-solid fa-arrow-left"></i>
          </Button>
          <div className="date-picker-container" ref={datePickerRef}>
            <button
              className="toolbar-label-button"
              onClick={toggleDatePicker}
              aria-expanded={isDatePickerOpen}
              aria-haspopup="dialog"
            >
              <span className="toolbar-label">{label}</span>
              <span className="calendar-icon">
                <i className="fa-solid fa-calendar"></i>
              </span>
            </button>
            {isDatePickerOpen && (
              <DatePickerComponent
                selected={date}
                locale={locale}
                onChange={handleDateChange}
              />
            )}
          </div>
          <Button variant="primary" onClick={() => onNavigate("NEXT")}>
            <i className="fa-solid fa-arrow-right"></i>
          </Button>
        </div>

        <div className="view-buttons">
          <Button variant="secondary" onClick={() => onView("month")}>
            {t("month")}
          </Button>
          <Button variant="secondary" onClick={() => onView("week")}>
            {t("week")}
          </Button>
          <Button variant="secondary" onClick={() => onView("day")}>
            {t("day")}
          </Button>
        </div>
      </div>

      {view === "day" && (
        <WeekStrip date={date} onNavigate={onNavigate} onView={onView} />
      )}
    </>
  );
};

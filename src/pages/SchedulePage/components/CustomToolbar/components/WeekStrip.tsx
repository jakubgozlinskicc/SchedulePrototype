import { format, startOfWeek, addDays, isSameDay, isToday } from "date-fns";
import type { NavigateAction } from "react-big-calendar";
import { useTranslationContext } from "../../../../../locales/useTranslationContext";
import { locales } from "../../../../../utils/calendarLocalizer/calendarLocalizer";
import { Button } from "../../../../../components/Button/Button";
import { useWeatherForecast } from "../../../../../hooks/useWeatherForecast/useWeatherForecast";
import { useLocationContext } from "../../../../../contexts/locationContext/useLocationContext";
import {
  getWeatherDisplayInfo,
  getWeatherIconClass,
} from "../../../../../utils/weatherUtils/weatherUtils";

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
  const { forecast } = useWeatherForecast();
  const { city } = useLocationContext();

  return (
    <div className="week-strip">
      {days.map((day, index) => {
        const isDayToday = isToday(day);
        const { shouldShow: showWeather, weather } = getWeatherDisplayInfo(
          day,
          forecast,
        );

        return (
          <Button
            key={day.toISOString()}
            variant="primary"
            isActive={isSameDay(day, date) && view === "day"}
            className={`week-strip-day ${isDayToday ? "is-today" : ""} ${showWeather ? "has-weather" : ""}`}
            onClick={() => {
              onView("day");
              onNavigate("DATE", day);
            }}
          >
            {format(day, "EEE dd", { locale })}
            {showWeather && weather && (
              <>
                <i
                  className={`fa-solid ${getWeatherIconClass(weather.weathercode)} weather-icon`}
                />
                <span
                  className={`weather-tooltip ${index >= 5 ? "tooltip-left" : ""}`}
                >
                  <span className="weather-temp">
                    {city.name}: {weather.temperatureMin}° /{" "}
                    {weather.temperatureMax}°
                  </span>
                </span>
              </>
            )}
          </Button>
        );
      })}
    </div>
  );
};

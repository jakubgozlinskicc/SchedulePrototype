import { format, startOfDay, isBefore, isAfter, addDays } from "date-fns";

export interface WeatherData {
  weathercode: number;
  temperatureMin: number;
  temperatureMax: number;
}

export interface WeatherDisplayInfo {
  shouldShow: boolean;
  weather?: WeatherData;
  dateKey: string;
}

export const getWeatherDisplayInfo = (
  day: Date,
  forecast: Map<string, WeatherData>,
): WeatherDisplayInfo => {
  const today = startOfDay(new Date());
  const maxForecastDate = addDays(today, 13);
  const dateKey = format(day, "yyyy-MM-dd");
  const weather = forecast.get(dateKey);

  const shouldShow =
    !isBefore(day, today) && !isAfter(day, maxForecastDate) && !!weather;

  return {
    shouldShow,
    weather,
    dateKey,
  };
};

const weatherCodes: Record<number, string> = {
  0: "fa-sun",
  1: "fa-sun",
  2: "fa-cloud-sun",
  3: "fa-cloud",
  45: "fa-smog",
  48: "fa-smog",
  51: "fa-cloud-sun-rain",
  53: "fa-cloud-sun-rain",
  55: "fa-cloud-rain",
  61: "fa-cloud-rain",
  63: "fa-cloud-showers-heavy",
  65: "fa-cloud-showers-heavy",
  71: "fa-snowflake",
  73: "fa-snowflake",
  75: "fa-snowflake",
  80: "fa-cloud-sun-rain",
  81: "fa-cloud-showers-heavy",
  82: "fa-cloud-bolt",
  95: "fa-cloud-bolt",
  96: "fa-cloud-bolt",
  99: "fa-cloud-bolt",
};

export function getWeatherIconClass(code: number): string {
  return weatherCodes[code] || "fa-temperature-half";
}

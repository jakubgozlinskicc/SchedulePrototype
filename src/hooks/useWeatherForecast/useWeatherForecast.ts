import { useState, useEffect } from "react";
import {
  weatherService,
  type DailyWeather,
} from "../../services/weather.service";
import { useLocationContext } from "../../contexts/locationContext/useLocationContext";

export function useWeatherForecast() {
  const { city } = useLocationContext();
  const [forecast, setForecast] = useState<Map<string, DailyWeather>>(
    new Map(),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    weatherService
      .getForecast(city.latitude, city.longitude)
      .then((data) => {
        if (!cancelled) {
          const map = new Map(data.map((d) => [d.date, d]));
          setForecast(map);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error(error);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [city.latitude, city.longitude]);

  return { forecast, loading };
}

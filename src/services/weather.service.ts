interface DailyWeather {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  weathercode: number;
}

interface ForecastResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
  };
}

class WeatherService {
  private baseUrl = "https://api.open-meteo.com/v1/forecast";
  private cache = new Map<
    string,
    { data: DailyWeather[]; timestamp: number }
  >();
  private cacheTime = 30 * 60 * 1000;

  async getForecast(
    latitude: number,
    longitude: number,
  ): Promise<DailyWeather[]> {
    const cacheKey = `${latitude},${longitude}`;
    const now = Date.now();
    const cached = this.cache.get(cacheKey);

    if (cached && now - cached.timestamp < this.cacheTime) {
      return cached.data;
    }

    const url =
      `${this.baseUrl}?` +
      new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        daily: "temperature_2m_max,temperature_2m_min,weathercode",
        forecast_days: "14",
        timezone: "Europe/Warsaw",
      });

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data: ForecastResponse = await response.json();

    const forecast = data.daily.time.map((date, i) => ({
      date,
      temperatureMax: Math.round(data.daily.temperature_2m_max[i]),
      temperatureMin: Math.round(data.daily.temperature_2m_min[i]),
      weathercode: data.daily.weathercode[i],
    }));

    this.cache.set(cacheKey, { data: forecast, timestamp: now });

    return forecast;
  }
}

export const weatherService = new WeatherService();
export type { DailyWeather };

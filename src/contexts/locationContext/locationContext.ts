import { createContext } from "react";
import type { CityCoordinates } from "../../hooks/useWeatherForecast/pickLocation";

export type LocationContextType = {
  city: CityCoordinates;
  setCity: (city: CityCoordinates) => void;
};

export const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

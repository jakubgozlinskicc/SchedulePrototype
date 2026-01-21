import { useState, type ReactNode } from "react";
import { LocationContext } from "./locationContext";
import {
  CITIES,
  type CityCoordinates,
} from "../../hooks/useWeatherForecast/pickLocation";

type LocationProviderProps = {
  children: ReactNode;
};

export function LocationProvider({ children }: LocationProviderProps) {
  const [city, setCity] = useState<CityCoordinates>(CITIES[0]);

  const value = {
    city,
    setCity,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

import { useTranslation } from "react-i18next";
import { useLocationContext } from "../../contexts/locationContext/useLocationContext";
import { CITIES } from "../../hooks/useWeatherForecast/pickLocation";
import "./CityPicker.css";

export function CityPicker() {
  const { city, setCity } = useLocationContext();
  const { t } = useTranslation();
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = CITIES.find((c) => c.name === e.target.value);
    if (selected) setCity(selected);
  };
  return (
    <div
      className="city-picker"
      data-tooltip={`${t("select-city")} \n ${city.name}`}
    >
      <i className="fa-solid fa-location-dot city-picker-icon" />
      <select
        value={city.name}
        onChange={handleChange}
        className="city-picker-select"
      >
        {CITIES.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}

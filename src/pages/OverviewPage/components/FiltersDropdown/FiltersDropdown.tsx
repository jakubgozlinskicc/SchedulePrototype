import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./FiltersDropdown.css";
import { useFiltersContext } from "../../context/useFiltersContext";
import { ColorSelect } from "./ColorSelect";
import { useClickOutside } from "../../../../hooks/useClickOutside";
import { Button } from "../../../../components/Button/Button";

export function FiltersDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { filters, activeFiltersCount, updateFilter, resetFilters } =
    useFiltersContext();
  const { t } = useTranslation();

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateFilter("dateFrom", value ? new Date(value) : null);
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateFilter("dateTo", value ? new Date(value) : null);
  };

  return (
    <div className="filters-dropdown" ref={dropdownRef}>
      <Button variant="secondary" onClick={() => setIsOpen(!isOpen)}>
        {t("filters")}
        <i className="fa-solid fa-filter"></i>
        {activeFiltersCount > 0 && (
          <span className="filters-badge">{activeFiltersCount}</span>
        )}
      </Button>
      <div className={`filters-panel ${isOpen ? "open" : ""}`}>
        <div className="filter-group">
          <label className="filter-label">
            <i
              className="fa-solid fa-hourglass-start"
              style={{ marginRight: "8px" }}
            ></i>
            {t("date-from")}
          </label>
          <input
            type="date"
            value={formatDateForInput(filters.dateFrom)}
            onChange={handleDateFromChange}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <i
              className="fa-solid fa-hourglass-end"
              style={{ marginRight: "8px" }}
            ></i>
            {t("date-to")}
          </label>
          <input
            type="date"
            value={formatDateForInput(filters.dateTo)}
            onChange={handleDateToChange}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-checkbox">
            <i className="fa-solid fa-backward-fast"></i>
            {t("show-past-events")}
            <input
              type="checkbox"
              checked={filters.showPastEvents}
              onChange={(e) => updateFilter("showPastEvents", e.target.checked)}
            />
          </label>
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <i
              className="fa-solid fa-palette"
              style={{ marginRight: "8px" }}
            ></i>
            {t("colors")}
          </label>
          <ColorSelect
            selectedColors={filters.colors}
            onChange={(colors) => updateFilter("colors", colors)}
          />
        </div>
        <Button variant="danger" onClick={resetFilters}>
          {t("reset-filters")}
          <i className="fa-solid fa-toilet"></i>
        </Button>
      </div>
    </div>
  );
}

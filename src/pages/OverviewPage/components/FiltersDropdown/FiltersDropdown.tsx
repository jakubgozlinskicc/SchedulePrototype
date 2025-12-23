import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./FiltersDropdown.css";
import { useFiltersContext } from "../../context/useFiltersContext";

export function FiltersDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { filters, updateFilter, resetFilters } = useFiltersContext();
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeFiltersCount = [
    filters.searchQuery,
    filters.showPastEvents,
    filters.dateFrom,
    filters.dateTo,
  ].filter(Boolean).length;

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
      <button className="filters-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {t("filters")}
        {activeFiltersCount > 0 && (
          <span className="filters-badge">{activeFiltersCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="filters-panel">
          <div className="filter-group">
            <label className="filter-label">{t("date-from")}</label>
            <input
              type="date"
              value={formatDateForInput(filters.dateFrom)}
              onChange={handleDateFromChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">{t("date-to")}</label>
            <input
              type="date"
              value={formatDateForInput(filters.dateTo)}
              onChange={handleDateToChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.showPastEvents}
                onChange={(e) =>
                  updateFilter("showPastEvents", e.target.checked)
                }
              />
              {t("show-past-events")}
            </label>
          </div>

          <button onClick={resetFilters} className="reset-filters-btn">
            {t("reset-filters")}
          </button>
        </div>
      )}
    </div>
  );
}

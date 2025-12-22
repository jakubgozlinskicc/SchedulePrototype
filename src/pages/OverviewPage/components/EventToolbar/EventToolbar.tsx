import { useTranslation } from "react-i18next";
import { FiltersDropdown } from "../FiltersDropdown/FiltersDropdown";
import { useFiltersContext } from "../../context/useFiltersContext";
import { useEventToolbar } from "./useEventToolbar/useEventToolbar";

export function EventToolbar() {
  const { t } = useTranslation();
  const { filters, updateFilter } = useFiltersContext();

  const {
    setToday,
    handleNextDay,
    handlePreviousDay,
    setCurrentDayRange,
    setCurrentWeekRange,
    setCurrentMonthRange,
  } = useEventToolbar();

  return (
    <div className="event-toolbar">
      <div className="toolbar-left-side">
        <div className="actions-buttons">
          <button className="nav-button">{t("btn-add")}</button>
          <button className="nav-button" onClick={setToday}>
            {t("today")}
          </button>
          <button className="nav-button" onClick={handlePreviousDay}>
            ←
          </button>
          <button className="nav-button" onClick={handleNextDay}>
            →
          </button>
        </div>
      </div>

      <div className="toolbar-center-side">
        <div className="search-events">
          <input
            type="text"
            placeholder={t("search-placeholder")}
            value={filters.searchQuery}
            onChange={(e) => updateFilter("searchQuery", e.target.value)}
            className="filter-input"
          />
        </div>
        <FiltersDropdown />
      </div>

      <div className="toolbar-right-side">
        <div className="view-buttons">
          <button className="view-button" onClick={setCurrentMonthRange}>
            {t("month")}
          </button>
          <button className="view-button" onClick={setCurrentWeekRange}>
            {t("week")}
          </button>
          <button className="view-button" onClick={setCurrentDayRange}>
            {t("day")}
          </button>
        </div>
      </div>
    </div>
  );
}

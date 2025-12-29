import { useTranslation } from "react-i18next";
import { FiltersDropdown } from "../FiltersDropdown/FiltersDropdown";
import { useFiltersContext } from "../../context/useFiltersContext";
import { useEventToolbar } from "./useEventToolbar/useEventToolbar";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

export function EventToolbar() {
  const { t } = useTranslation();
  const { filters, updateFilter } = useFiltersContext();
  const navigate = useNavigate();

  const {
    setToday,
    handleNextDay,
    handlePreviousDay,
    setCurrentDayRange,
    setCurrentWeekRange,
    setCurrentMonthRange,
  } = useEventToolbar();

  return (
    <>
      <div className="event-toolbar">
        <div className="toolbar-left-side">
          <div className="actions-buttons">
            <button
              className="nav-button"
              onClick={() => navigate("/event/add")}
            >
              {t("btn-add")} <i className="fa-solid fa-calendar-plus"></i>
            </button>
            <button className="nav-button" onClick={setToday}>
              {t("today")}
            </button>
            <button className="nav-button" onClick={handlePreviousDay}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <button className="nav-button" onClick={handleNextDay}>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <div className="toolbar-center-side">
          <div className="search-events">
            <i className="fa-solid fa-magnifying-glass"></i>
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
      <Toaster position="top-center" />
    </>
  );
}

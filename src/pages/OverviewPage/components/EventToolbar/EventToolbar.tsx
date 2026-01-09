import { useTranslation } from "react-i18next";
import { FiltersDropdown } from "../FiltersDropdown/FiltersDropdown";
import { useFiltersContext } from "../../context/useFiltersContext";
import { useEventToolbar } from "./useEventToolbar/useEventToolbar";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Button } from "../../../../components/Button/Button";

export function EventToolbar() {
  const { t } = useTranslation();
  const { filters, updateFilter } = useFiltersContext();
  const navigate = useNavigate();

  const { currentView, setToday, handleNext, handlePrevious, changeView } =
    useEventToolbar();

  return (
    <>
      <div className="event-toolbar">
        <div className="toolbar-left-side">
          <div className="actions-buttons">
            <Button variant="primary" onClick={() => navigate("/event/add")}>
              {t("btn-add")} <i className="fa-solid fa-calendar-plus"></i>
            </Button>
            <Button variant="primary" onClick={setToday}>
              {t("today")}
            </Button>
            <Button variant="primary" onClick={handlePrevious}>
              <i className="fa-solid fa-arrow-left"></i>
            </Button>
            <Button variant="primary" onClick={handleNext}>
              <i className="fa-solid fa-arrow-right"></i>
            </Button>
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
            <Button
              variant="secondary"
              onClick={() => changeView("month")}
              isActive={currentView === "month"}
            >
              {t("month")}
            </Button>
            <Button
              variant="secondary"
              onClick={() => changeView("week")}
              isActive={currentView === "week"}
            >
              {t("week")}
            </Button>
            <Button
              variant="secondary"
              onClick={() => changeView("day")}
              isActive={currentView === "day"}
            >
              {t("day")}
            </Button>
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </>
  );
}

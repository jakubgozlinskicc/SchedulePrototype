import { useNavigate } from "react-router-dom";
import "./components/EventList/EventList.css";
import "./components/FiltersDropdown/FiltersDropdown.css";
import "./components/EventToolbar/EventToolbar.css";
import "./OverviewPage.css";
import { useTranslationContext } from "../../locales/useTranslationContext";
import type { Language } from "../../contexts/translationContext/translationContext";
import { EventList } from "./components/EventList/EventList";
import { useTranslation } from "react-i18next";
import { FiltersProvider } from "./context/FiltersProvider";
import { useFiltersContext } from "./context/useFiltersContext";
import { locales } from "../../utils/calendarLocalizer/calendarLocalizer";
import { format } from "date-fns";
import { EventToolbar } from "./components/EventToolbar/EventToolbar";

function OverviewPageContent() {
  const navigate = useNavigate();
  const { currentLanguage, changeLanguage } = useTranslationContext();
  const { filters } = useFiltersContext();
  const { t } = useTranslation();

  const locale = locales[currentLanguage];

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    changeLanguage(event.target.value as Language);
  };

  const formatDate = (date: Date) => format(date, "d MMM yyyy", { locale });

  return (
    <div className="overview-page">
      <div className="top-controls">
        <button className="overview-button" onClick={() => navigate("/")}>
          Schedule <i className="fa-regular fa-calendar"></i>
        </button>
        <select
          className="language-select"
          value={currentLanguage}
          onChange={handleLanguageChange}
          style={{ marginLeft: "10px", padding: "5px" }}
        >
          <option value="enUS">EN</option>
          <option value="pl">PL</option>
        </select>
      </div>
      <header className="overview-header">
        <h1>
          Overview
          <i className="fa-solid fa-list" style={{ marginLeft: "8px" }}></i>
        </h1>
      </header>
      <div className="overview-wrapper">
        <div className="overview-toolbar">
          <EventToolbar />
        </div>
        <main className="overview-content">
          <h2>{t("events")}</h2>
          <div className="active-dates">
            {filters.dateFrom && (
              <h3>
                {t("date-from")}: {formatDate(filters.dateFrom)}
              </h3>
            )}
            {filters.dateTo && (
              <h3>
                {t("date-to")}: {formatDate(filters.dateTo)}
              </h3>
            )}
          </div>
          <EventList />
        </main>
      </div>
    </div>
  );
}

function OverviewPage() {
  return (
    <FiltersProvider>
      <OverviewPageContent />
    </FiltersProvider>
  );
}

export default OverviewPage;

import "./components/EventList/EventList.css";
import "./components/FiltersDropdown/FiltersDropdown.css";
import "./components/EventToolbar/EventToolbar.css";
import "./OverviewPage.css";
import { useTranslationContext } from "../../locales/useTranslationContext";
import { EventList } from "./components/EventList/EventList";
import { useTranslation } from "react-i18next";
import { FiltersProvider } from "./context/FiltersProvider";
import { useFiltersContext } from "./context/useFiltersContext";
import { locales } from "../../utils/calendarLocalizer/calendarLocalizer";
import { format } from "date-fns";
import { EventToolbar } from "./components/EventToolbar/EventToolbar";
import { TopControls } from "../../components/TopControls/TopControls";

function OverviewPageContent() {
  const { currentLanguage } = useTranslationContext();
  const { filters } = useFiltersContext();
  const { t } = useTranslation();

  const locale = locales[currentLanguage];

  const formatDate = (date: Date) => format(date, "d MMM yyyy", { locale });

  return (
    <div className="overview-page">
      <TopControls
        buttonText="Schedule"
        buttonIcon="fa-regular fa-calendar"
        navigateTo="/"
      ></TopControls>
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
            {filters.dateFrom && <h3>{formatDate(filters.dateFrom)}</h3>}
            {filters.dateFrom && filters.dateTo && (
              <h3>
                <i className="fa-solid fa-arrow-right"></i>
              </h3>
            )}
            {filters.dateTo && <h3>{formatDate(filters.dateTo)}</h3>}
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

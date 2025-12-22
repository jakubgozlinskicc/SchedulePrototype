import { useNavigate } from "react-router-dom";
import "./components/EventList/EventList.css";
import "./components/FiltersDropdown/FiltersDropdown.css";
import "./OverviewPage.css";
import { useTranslationContext } from "../../locales/useTranslationContext";
import type { Language } from "../../contexts/translationContext/translationContext";
import { EventList } from "./components/EventList/EventList";
import { useTranslation } from "react-i18next";
import { FiltersDropdown } from "./components/FiltersDropdown/FiltersDropdown";
import { FiltersProvider } from "./context/FiltersProvider";

function OverviewPage() {
  const navigate = useNavigate();

  const { currentLanguage, changeLanguage } = useTranslationContext();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    changeLanguage(event.target.value as Language);
  };

  const { t } = useTranslation();

  return (
    <FiltersProvider>
      <div className="overview-page">
        <div className="top-controls">
          <button className="overview-button" onClick={() => navigate("/")}>
            Schedule
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
          <h1>Overview</h1>
        </header>
        <div className="overview-toolbar">
          <FiltersDropdown />
        </div>
        <main className="overview-content">
          <h2>{t("events")}</h2>
          <EventList />
        </main>
      </div>
    </FiltersProvider>
  );
}

export default OverviewPage;

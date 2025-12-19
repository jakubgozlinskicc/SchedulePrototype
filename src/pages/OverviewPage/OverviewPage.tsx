import { useNavigate } from "react-router-dom";
import "./components/EventList.css";
import "./OverviewPage.css";
import { useTranslationContext } from "../../locales/useTranslationContext";
import type { Language } from "../../contexts/translationContext/translationContext";
import { useEventDataContext } from "../../events/useEvents/useEventDataContext/useEventDataContext";
import { EventList } from "./components/EventList";

function OverviewPage() {
  const navigate = useNavigate();

  const { events } = useEventDataContext();

  const { currentLanguage, changeLanguage } = useTranslationContext();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    changeLanguage(event.target.value as Language);
  };

  return (
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
      <main className="overview-content">
        <h2>Events</h2>

        {events.length === 0 ? (
          <div className="no-events">No events found</div>
        ) : (
          <EventList />
        )}
      </main>
    </div>
  );
}

export default OverviewPage;

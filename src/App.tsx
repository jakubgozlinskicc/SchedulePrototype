import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SchedulePage from "./pages/schedulePage/schedulePage";
import OverviewPage from "./pages/OverviewPage/OverviewPage";
import { EventFormPage } from "./pages/EventFormPage/EventFormPage";
import { TranslationProvider } from "./contexts/translationContext/translationProvider";
import { EventDataProvider } from "./events/eventContext/eventDataProvider";
import Nav from "./components/Nav/Nav";
import { PageTransition } from "./components/PageTransition/PageTransition";

function App() {
  return (
    <BrowserRouter>
      <TranslationProvider>
        <EventDataProvider>
          <Nav />
          <main className="main-content">
            <PageTransition>
              <Routes>
                <Route path="/" element={<SchedulePage />} />
                <Route path="/overview" element={<OverviewPage />} />
                <Route path="/event/add" element={<EventFormPage />} />
                <Route path="/event/edit" element={<EventFormPage />} />
              </Routes>
            </PageTransition>
          </main>
        </EventDataProvider>
      </TranslationProvider>
    </BrowserRouter>
  );
}

export default App;

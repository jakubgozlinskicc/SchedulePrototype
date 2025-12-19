import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SchedulePage from "./pages/schedulePage/schedulePage";
import OverviewPage from "./pages/OverviewPage/OverviewPage";
import { TranslationProvider } from "./contexts/translationContext/translationProvider";
import { EventDataProvider } from "./events/eventContext/eventDataProvider";

function App() {
  return (
    <BrowserRouter>
      <TranslationProvider>
        <EventDataProvider>
          <Routes>
            <Route path="/" element={<SchedulePage />} />
            <Route path="/overview" element={<OverviewPage />} />
          </Routes>
        </EventDataProvider>
      </TranslationProvider>
    </BrowserRouter>
  );
}

export default App;

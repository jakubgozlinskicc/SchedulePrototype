import { Routes, Route } from "react-router-dom";
import SchedulePage from "./pages/schedulePage/schedulePage";
import OverviewPage from "./pages/OverviewPage/OverviewPage";
import { EventFormPage } from "./pages/EventFormPage/EventFormPage";
import { PageTransition } from "./components/PageTransition/PageTransition";

export function AppRoutes() {
  return (
    <PageTransition>
      <Routes>
        <Route path="/" element={<SchedulePage />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/event/add" element={<EventFormPage />} />
        <Route path="/event/edit" element={<EventFormPage />} />
      </Routes>
    </PageTransition>
  );
}

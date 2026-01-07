import { Routes, Route } from "react-router-dom";
import SchedulePage from "./pages/schedulePage/schedulePage";
import OverviewPage from "./pages/OverviewPage/OverviewPage";
import { PageTransition } from "./components/PageTransition/PageTransition";
import { AddEventFormPage } from "./pages/AddEventFormPage/AddEventFormPage";
import { EditEventFormPage } from "./pages/EditEventFormPage/EditEventFormPage";

export function AppRoutes() {
  return (
    <PageTransition>
      <Routes>
        <Route path="/" element={<SchedulePage />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/event/add" element={<AddEventFormPage />} />
        <Route path="/event/edit/:id" element={<EditEventFormPage />} />
      </Routes>
    </PageTransition>
  );
}

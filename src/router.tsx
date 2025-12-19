import { createBrowserRouter } from "react-router-dom";
import SchedulePage from "./pages/schedulePage/schedulePage";
import OverviewPage from "./pages/OverviewPage/OverviewPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SchedulePage />,
  },
  {
    path: "/overview",
    element: <OverviewPage />,
  },
]);

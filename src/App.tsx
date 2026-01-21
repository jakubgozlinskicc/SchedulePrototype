import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { TranslationProvider } from "./contexts/translationContext/translationProvider";
import Nav from "./components/Nav/Nav";
import { AppRoutes } from "./AppRoutes";
import { LocationProvider } from "./contexts/locationContext/locationProvider";
import "weather-icons/css/weather-icons.css";

function App() {
  return (
    <BrowserRouter>
      <TranslationProvider>
        <LocationProvider>
          <Nav />
          <main className="main-content">
            <AppRoutes />
          </main>
        </LocationProvider>
      </TranslationProvider>
    </BrowserRouter>
  );
}

export default App;

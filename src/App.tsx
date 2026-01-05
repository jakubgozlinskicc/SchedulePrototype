import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { TranslationProvider } from "./contexts/translationContext/translationProvider";
import { EventDataProvider } from "./events/eventContext/eventDataProvider";
import Nav from "./components/Nav/Nav";
import { AppRoutes } from "./AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <TranslationProvider>
        <EventDataProvider>
          <Nav />
          <main className="main-content">
            <AppRoutes />
          </main>
        </EventDataProvider>
      </TranslationProvider>
    </BrowserRouter>
  );
}

export default App;

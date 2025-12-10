import "./App.css";
import SchedulePage from "./pages/schedulePage/schedulePage";
import { EventDataProvider } from "./contexts/eventDataProvider";
import { TranslationProvider } from "./contexts/translationProvider";

function App() {
  return (
    <>
      <TranslationProvider>
        <EventDataProvider>
          <SchedulePage />
        </EventDataProvider>
      </TranslationProvider>
    </>
  );
}
export default App;

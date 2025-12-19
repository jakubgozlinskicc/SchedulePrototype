import "./App.css";
import SchedulePage from "./pages/schedulePage/schedulePage";
import { TranslationProvider } from "./contexts/translationContext/translationProvider";
import { EventDataProvider } from "./events/eventContext/eventDataProvider";

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

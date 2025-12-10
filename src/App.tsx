import "./App.css";
import SchedulePage from "./pages/schedulePage/schedulePage";
import { EventDataProvider } from "./contexts/eventContext/eventDataProvider";
import { TranslationProvider } from "./contexts/translationContext/translationProvider";

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

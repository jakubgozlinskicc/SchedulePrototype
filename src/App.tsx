import "./App.css";
import SchedulePage from "./pages/schedulePage/schedulePage";
import { EventDataProvider } from "./pages/schedulePage/eventContext/eventDataProvider";
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

import "./App.css";
import SchedulePage from "./pages/schedulePage/schedulePage";
import { EventDataProvider } from "./contexts/eventDataProvider";

function App() {
  return (
    <>
      <EventDataProvider>
        <SchedulePage />
      </EventDataProvider>
    </>
  );
}
export default App;

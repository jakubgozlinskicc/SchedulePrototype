import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { TranslationProvider } from "./contexts/translationContext/translationProvider";
import Nav from "./components/Nav/Nav";
import { AppRoutes } from "./AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <TranslationProvider>
        <Nav />
        <main className="main-content">
          <AppRoutes />
        </main>
      </TranslationProvider>
    </BrowserRouter>
  );
}

export default App;

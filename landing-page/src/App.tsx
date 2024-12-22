import { BrowserRouter, Route, Routes } from "react-router";
import MainPage from "./pages";
import RegistrationCompletePage from "./pages/registration-complete";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/registration-complete"
          element={<RegistrationCompletePage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

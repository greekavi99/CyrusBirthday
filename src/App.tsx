import { BrowserRouter, Routes, Route } from "react-router-dom";
import Birthday from "./Birthday";
import MonthGame from "./MonthGame";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Birthday />} />
        <Route path="/game" element={<MonthGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Birthday from "./Birthday";
import MonthGame from "./MonthGame";
import PuzzleGame from "./PuzzleGame";
import PacManGame from "./PacManGame";
import ScoreBoard from "./ScoreBoard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Birthday />} />
        <Route path="/game" element={<MonthGame />} />
        <Route path="/puzzle" element={<PuzzleGame />} />
        <Route path="/pacman" element={<PacManGame />} />
        <Route path="/scores" element={<ScoreBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

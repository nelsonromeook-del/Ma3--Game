import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GengeRunner from "./components/UI/GengeRunner/GengeRunner";
import RouteSelection from "./components/UI/GengeRunner/RouteSelection/RouteSelection";
import GameScreen from "./components/UI/GengeRunner/GameScreen/GameScreen";
import GameOver from "./components/UI/GengeRunner/GameOver/GameOver";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GengeRunner />} />
        <Route path="/routes" element={<RouteSelection />} />
        <Route path="/play" element={<GameScreen onGameOver={() => window.location.href="/game-over"} />} />
        <Route path="/game-over" element={<GameOver />} />
      </Routes>
    </Router>
  );
}

export default App;

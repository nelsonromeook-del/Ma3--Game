// src/components/GengeRunner/GengeRunner.jsx
import { useState } from 'react';
import RouteSelection from './RouteSelection/RouteSelection';
import GameScreen from './GameScreen/GameScreen';
import GameOver from './GameOver/GameOver';

export default function GengeRunner() {
  const [screen, setScreen] = useState('select'); // 'select' | 'game' | 'over'
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [gameStats, setGameStats] = useState({
    fare: 0,
    level: 1,
    squad: 0,
    revenueLost: 0,
  });

  const startGame = (route) => {
    setSelectedRoute(route);
    setScreen('game');
    // reset stats when starting new game
    setGameStats({ fare: 0, level: 1, squad: 0, revenueLost: 0 });
  };

  const endGame = (finalStats) => {
    setGameStats(finalStats);
    setScreen('over');
  };

  return (
    <div className="genge-runner" style={{ height: '100vh', background: '#0a0a15', color: 'white' }}>
      {screen === 'select' && <RouteSelection onSelectRoute={startGame} />}
      {screen === 'game' && (
        <GameScreen route={selectedRoute} onGameOver={endGame} />
      )}
      {screen === 'over' && (
        <GameOver stats={gameStats} onRetry={() => setScreen('select')} />
      )}
    </div>
  );
}
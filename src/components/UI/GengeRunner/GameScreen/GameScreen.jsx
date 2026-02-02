// src/components/GengeRunner/GameScreen/GameScreen.jsx
import { useState, useEffect, useRef } from 'react';
import './GameScreen.css';

export default function GameScreen({ route, onGameOver }) {
  const [lane, setLane] = useState(1);           // 0=left, 1=center, 2=right
  const [distance, setDistance] = useState(0);   // total distance traveled
  const [speed, setSpeed] = useState(1.2);       // base speed — can increase per level
  const [stats, setStats] = useState({
    fare: 0,
    level: 1,
    squad: 0,
  });
  const [entities, setEntities] = useState([]);  // passengers & obstacles
  const [message, setMessage] = useState(null);  // temporary popup " +Ksh 15" or "AJALI!"
  const gameRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Generate new entity (passenger or obstacle)
  const spawnEntity = () => {
    const type = Math.random() < 0.7 ? 'passenger' : 'obstacle';
    const lanePos = Math.floor(Math.random() * 3); // 0,1,2

    const newEntity = {
      id: Date.now() + Math.random(),
      type,
      lane: lanePos,
      y: -10, // start above screen
      name: type === 'passenger' ? ['Zimmerman', 'Maina', 'Wanjiku', 'Ochieng'][Math.floor(Math.random()*4)] : null,
    };

    setEntities(prev => [...prev, newEntity]);
  };

  // Game loop using requestAnimationFrame (smoother than setInterval)
  useEffect(() => {
    let lastTime = performance.now();

    const gameLoop = (time) => {
      const delta = (time - lastTime) / 1000; // seconds
      lastTime = time;

      setDistance(prev => {
        const newDist = prev + speed * delta * 100; // arbitrary units

        // Spawn new entities every ~1.5–3 seconds
        if (Math.random() < delta * 0.7) {
          spawnEntity();
        }

        // Update entities position
        setEntities(prevEntities =>
          prevEntities
            .map(ent => ({
              ...ent,
              y: ent.y + speed * delta * 120, // fall speed
            }))
            .filter(ent => ent.y < 110) // remove when off screen
        );

        // Check collisions / pickups
        setEntities(currentEntities => {
          let crash = false;
          let pickup = false;

          const updated = currentEntities.filter(ent => {
            if (ent.y >= 80 && ent.y <= 95) { // near matatu height
              if (ent.lane === lane) {
                if (ent.type === 'obstacle') {
                  crash = true;
                  return false;
                }
                if (ent.type === 'passenger') {
                  pickup = true;
                  setStats(s => ({
                    ...s,
                    fare: s.fare + 15,
                    squad: s.squad + 1,
                  }));
                  setMessage({ text: `+Ksh 15 • +1`, type: 'success' });
                  setTimeout(() => setMessage(null), 1200);
                  return false;
                }
              }
            }
            return true;
          });

          if (crash) {
            setTimeout(() => {
              onGameOver({
                ...stats,
                revenueLost: stats.fare,
                fare: 0,
              });
            }, 300);
          }

          return updated;
        });

        // Level up every 2000 distance units
        if (newDist > stats.level * 2000) {
          setStats(s => ({ ...s, level: s.level + 1 }));
          setSpeed(s => s + 0.3); // speed increases
        }

        return newDist;
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [lane, speed, stats, onGameOver]);

  const handleLaneChange = (dir) => {
    setLane(prev => Math.max(0, Math.min(2, prev + dir)));
  };

  // Keyboard support (← → arrows)
  useEffect(() => {
    const handleKey = e => {
      if (e.key === 'ArrowLeft')  handleLaneChange(-1);
      if (e.key === 'ArrowRight') handleLaneChange(1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="game-screen" ref={gameRef}>
      <div className="hud">
        <div className="stat">Ksh {stats.fare}</div>
        <div className="stat">LEVEL {stats.level}</div>
        <div className="stat">SQUAD {stats.squad}</div>
      </div>

      <div className="road-container">
        <div className="road" style={{ transform: `translateY(-${Math.min(distance % 100, 100)}%)` }}>
          {/* Matatu (player) */}
          <div className="matatu" style={{ left: `${lane * 33.33 + 5}%` }}>
            🚌
          </div>

          {/* Entities (passengers & obstacles) */}
          {entities.map(ent => (
            <div
              key={ent.id}
              className={`entity ${ent.type}`}
              style={{
                left: `${ent.lane * 33.33 + 8}%`,
                top: `${ent.y}%`,
              }}
            >
              {ent.type === 'passenger' ? '🧍' : '🚧'}
              {ent.name && <div className="name">{ent.name}</div>}
            </div>
          ))}
        </div>

        {/* Temporary message popup */}
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>

      <div className="controls">
        <button onClick={() => handleLaneChange(-1)}>←</button>
        <button onClick={() => handleLaneChange(1)}>→</button>
      </div>

      <div className="route-name">{route || 'Thika Road Express'}</div>
    </div>
  );
}
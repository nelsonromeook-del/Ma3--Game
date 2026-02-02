import { useState, useEffect, useRef } from "react";
import "./GameScreen.css";

const LANES = [0, 1, 2];
const TOTAL_DISTANCE = 1000; // total game "distance" to CBD

export default function GameScreen({ onGameOver }) {
  const [lane, setLane] = useState(1);
  const [fare, setFare] = useState(0);
  const [squad, setSquad] = useState(0);
  const [level, setLevel] = useState(1);
  const [progress, setProgress] = useState(0); // distance progress %
  const [obstacles, setObstacles] = useState([]);
  const [passengers, setPassengers] = useState([]);

  const speedRef = useRef(5);
  const laneLock = useRef(false);
  const gameOverRef = useRef(false);

  /* ================= GAME LOOP ================= */
  useEffect(() => {
    const loop = setInterval(() => {
      if (gameOverRef.current) return;

      speedRef.current = 5 + level * 0.5;

      // Move obstacles
      setObstacles((prev) =>
        prev
          .map((o) => ({ ...o, y: o.y + speedRef.current }))
          .filter((o) => o.y < 100)
      );

      // Move passengers
      setPassengers((prev) =>
        prev
          .map((p) => ({ ...p, y: p.y + speedRef.current }))
          .filter((p) => {
            if (p.y > 100) return false; // missed passenger
            return true;
          })
      );

      // Spawn obstacle
      if (Math.random() < 0.03) {
        setObstacles((prev) => [...prev, { id: Date.now(), lane: randLane(), y: -10 }]);
      }

      // Spawn passenger
      if (Math.random() < 0.04) {
        setPassengers((prev) => [...prev, { id: Date.now() + 1, lane: randLane(), y: -10 }]);
      }

      // Collision detection with obstacles
      obstacles.forEach((o) => {
        if (o.lane === lane && o.y > 70 && o.y < 85) {
          endGame(false); // player crashed
        }
      });

      // Collision detection with passengers
      setPassengers((prev) =>
        prev.filter((p) => {
          if (p.lane === lane && p.y > 70 && p.y < 85) {
            setFare((f) => f + 20);
            setSquad((s) => s + 1);
            return false;
          }
          return true;
        })
      );

      // Level up
      if (fare > level * 200) setLevel((l) => l + 1);

      // Increase progress
      setProgress((p) => {
        const next = p + 0.6;
        if (next >= TOTAL_DISTANCE) {
          endGame(true); // player successfully reached CBD
          return TOTAL_DISTANCE;
        }
        return next;
      });
    }, 60);

    return () => clearInterval(loop);
  }, [lane, obstacles, fare, level]);

  /* ================= HELPERS ================= */
  const randLane = () => LANES[Math.floor(Math.random() * 3)];

  const endGame = (success) => {
    if (gameOverRef.current) return;
    gameOverRef.current = true;

    onGameOver?.({
      fare,
      squad,
      level,
      success,
    });
  };

  /* ================= LANE SWITCH ================= */
  const switchLane = (dir) => {
    if (laneLock.current) return;
    setLane((prev) => {
      const next = prev + dir;
      if (next < 0 || next > 2) return prev;
      laneLock.current = true;
      setTimeout(() => (laneLock.current = false), 130);
      return next;
    });
  };

  /* ================= KEYBOARD CONTROLS ================= */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") switchLane(-1);
      if (e.key === "ArrowRight") switchLane(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="game-screen">
      {/* HUD */}
      <div className="hud">
        <div>Ksh {fare}</div>
        <div>LEVEL {level}</div>
        <div>SQUAD {squad}</div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(progress / TOTAL_DISTANCE) * 100}%` }}
        ></div>
      </div>

      {/* Road */}
      <div className="road-view">
        <div className="matatu" style={{ left: `${lane * 33.33 + 16.5}%` }}>
          🚌
        </div>
        {obstacles.map((o) => (
          <div
            key={o.id}
            className="obstacle"
            style={{ left: `${o.lane * 33.33 + 20}%`, top: `${o.y}%` }}
          >
            🚧
          </div>
        ))}
        {passengers.map((p) => (
          <div
            key={p.id}
            className="passenger"
            style={{ left: `${p.lane * 33.33 + 20}%`, top: `${p.y}%` }}
          >
            🧍
          </div>
        ))}
      </div>
    </div>
  );
}

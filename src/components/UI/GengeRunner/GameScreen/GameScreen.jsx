import { useState, useEffect, useRef } from "react";
import "./GameScreen.css";

const LANES = [0, 1, 2];

export default function GameScreen({ onGameOver }) {
  const [lane, setLane] = useState(1);
  const [fare, setFare] = useState(0);
  const [squad, setSquad] = useState(0);
  const [level, setLevel] = useState(1);

  const [obstacles, setObstacles] = useState([]);
  const [passengers, setPassengers] = useState([]);

  const speedRef = useRef(5);
  const laneLock = useRef(false);
  const gameOverRef = useRef(false);
  const missedPassengers = useRef(0);

  /* ================= GAME LOOP ================= */
  useEffect(() => {
    const loop = setInterval(() => {
      if (gameOverRef.current) return;

      // Increase difficulty
      speedRef.current = 5 + level * 0.8;

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
            if (p.y > 100) {
              missedPassengers.current += 1;
              return false;
            }
            return true;
          })
      );

      // Spawn obstacle
      if (Math.random() < 0.025) {
        setObstacles((prev) => [
          ...prev,
          { id: Date.now(), lane: randLane(), y: -10 },
        ]);
      }

      // Spawn passenger
      if (Math.random() < 0.035) {
        setPassengers((prev) => [
          ...prev,
          { id: Date.now() + 1, lane: randLane(), y: -10 },
        ]);
      }

      // Collision — obstacles
      obstacles.forEach((o) => {
        if (o.lane === lane && o.y > 70 && o.y < 85) {
          endGame(true);
        }
      });

      // Collision — passengers
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
      if (fare > level * 200) {
        setLevel((l) => l + 1);
      }

      // Police trigger if too many missed
      if (missedPassengers.current >= 5) {
        endGame(true);
      }
    }, 60);

    return () => clearInterval(loop);
  }, [lane, obstacles, fare, level]);

  /* ================= HELPERS ================= */
  const randLane = () => LANES[Math.floor(Math.random() * 3)];

  const endGame = (crash) => {
    if (gameOverRef.current) return;
    gameOverRef.current = true;

    onGameOver({
      fare: crash ? 0 : fare,
      squad,
      level,
      revenueLost: crash ? fare : 0,
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

  /* ================= SWIPE CONTROLS ================= */
  useEffect(() => {
    let startX = null;
    const onTouchStart = (e) => (startX = e.touches[0].clientX);
    const onTouchEnd = (e) => {
      if (startX === null) return;
      const diff = e.changedTouches[0].clientX - startX;
      if (diff > 50) switchLane(1);
      if (diff < -50) switchLane(-1);
      startX = null;
    };
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

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

      {/* ROAD */}
      <div className="road-view">
        {/* Player */}
        <div
          className="matatu subway-move"
          style={{ left: `${lane * 33.33 + 16.5}%` }}
        >
          🚌
        </div>

        {/* Obstacles */}
        {obstacles.map((o) => (
          <div
            key={o.id}
            className="obstacle"
            style={{
              left: `${o.lane * 33.33 + 20}%`,
              top: `${o.y}%`,
            }}
          >
            🚧
          </div>
        ))}

        {/* Passengers */}
        {passengers.map((p) => (
          <div
            key={p.id}
            className="passenger"
            style={{
              left: `${p.lane * 33.33 + 20}%`,
              top: `${p.y}%`,
            }}
          >
            🧍
          </div>
        ))}
      </div>

      {/* CONTROLS */}
      <div className="controls">
        <button onClick={() => switchLane(-1)}>←</button>
        <button onClick={() => switchLane(1)}>→</button>
      </div>
    </div>
  );
}

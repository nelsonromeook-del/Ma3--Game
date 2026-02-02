import { useEffect, useRef } from "react";

export default function useGameLogic({
  lane,
  fare,
  setFare,
  squad,
  setSquad,
  level,
  setLevel,
  obstacles,
  setObstacles,
  passengers,
  setPassengers,
  onGameOver,
}) {
  const speed = useRef(4);
  const missed = useRef(0);

  useEffect(() => {
    const loop = setInterval(() => {
      speed.current += 0.01;

      setObstacles((obs) =>
        obs
          .map((o) => ({ ...o, y: o.y + speed.current }))
          .filter((o) => o.y < 100)
      );

      setPassengers((pax) =>
        pax
          .map((p) => ({ ...p, y: p.y + speed.current }))
          .filter((p) => {
            if (p.y > 100) missed.current++;
            return p.y < 100;
          })
      );

      if (Math.random() < 0.03) {
        setObstacles((o) => [
          ...o,
          { id: Date.now(), lane: Math.floor(Math.random() * 3), y: -10 },
        ]);
      }

      if (Math.random() < 0.04) {
        setPassengers((p) => [
          ...p,
          { id: Date.now() + 1, lane: Math.floor(Math.random() * 3), y: -10 },
        ]);
      }

      obstacles.forEach((o) => {
        if (o.lane === lane && o.y > 70 && o.y < 85) {
          onGameOver({ fare: 0, squad, level, revenueLost: fare });
        }
      });

      setPassengers((pax) =>
        pax.filter((p) => {
          if (p.lane === lane && p.y > 70 && p.y < 85) {
            setFare((f) => f + 20);
            setSquad((s) => s + 1);
            return false;
          }
          return true;
        })
      );

      if (fare >= level * 200) setLevel((l) => l + 1);
      if (missed.current >= 5)
        onGameOver({ fare: 0, squad, level, revenueLost: fare });
    }, 60);

    return () => clearInterval(loop);
  }, [lane, obstacles, fare]);
}

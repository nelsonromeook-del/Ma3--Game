import { useEffect } from "react";

export default function useKeyboard(setLane) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") {
        setLane((l) => Math.max(0, l - 1));
      }
      if (e.key === "ArrowRight") {
        setLane((l) => Math.min(2, l + 1));
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}

import React from "react";
import "./Scoreboard.css";

export default function Scoreboard({ fare, squad, level, highScore }) {
  return (
    <div className="scoreboard">
      <div className="score-item">
        <div className="label">FARE</div>
        <div className="value">Ksh {fare}</div>
      </div>

      <div className="score-item">
        <div className="label">SQUAD</div>
        <div className="value">{squad}</div>
      </div>

      <div className="score-item">
        <div className="label">LEVEL</div>
        <div className="value">{level}</div>
      </div>

      {highScore !== undefined && (
        <div className="score-item high-score">
          <div className="label">HIGH SCORE</div>
          <div className="value">Ksh {highScore}</div>
        </div>
      )}
    </div>
  );
}
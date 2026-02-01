// src/components/GengeRunner/RouteSelection/RouteSelection.jsx
import "./RouteSelection.css";

export default function RouteSelection({ onSelectRoute }) {
  return (
    <div className="screen-container">
      <div className="header">
        <h1 className="title">GENGE RUNNER</h1>
        <button className="sound-btn" aria-label="Toggle sound">
          🔊
        </button>
      </div>

      <p className="subtitle">NAIROBI MATATU SIMULATOR</p>

      <div className="matatu-icon">
        <div className="matatu-body">
          <div className="wheel wheel-left" />
          <div className="wheel wheel-right" />
          <div className="window-strip" />
        </div>
      </div>

      <h2 className="select-title">SELECT YOUR ROUTE</h2>

      <div className="routes-container">
        <button
          className="route-card thika"
          onClick={() => onSelectRoute("Thika Road Express")}
        >
          <div className="route-content">
            <div className="route-info">
              <h3>Thika Road Express</h3>
              <p>RUIRU → CBD</p>
            </div>
            <span className="arrow">➜</span>
          </div>
        </button>

        <button
          className="route-card jogoo"
          onClick={() => onSelectRoute("Jogoo Road Pulse")}
        >
          <div className="route-content">
            <div className="route-info">
              <h3>Jogoo Road Pulse</h3>
              <p>KAYOLE → CBD</p>
            </div>
            <span className="arrow">➜</span>
          </div>
        </button>
      </div>

      <div className="footer-text">
        <p>PICK UP SQUAD, DROP AT STAGES.</p>
        <p>FINAL STOP IS CBD.</p>
      </div>
    </div>
  );
}

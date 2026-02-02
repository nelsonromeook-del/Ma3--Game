import { useNavigate } from "react-router-dom";
import "./RouteSelection.css";

export default function RouteSelection() {
  const navigate = useNavigate();

  return (
    <div className="route-selection-container">
      <h2>Select Your Route</h2>
      <button onClick={() => navigate("/play")}>Thika Road Express</button>
      <button onClick={() => navigate("/play")}>Jogoo Road Pulse</button>
    </div>
  );
}

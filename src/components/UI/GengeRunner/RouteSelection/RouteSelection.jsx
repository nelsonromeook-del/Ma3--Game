import { useNavigate } from "react-router-dom";
import "./RouteSelection.css";

export default function RouteSelection() {
  const navigate = useNavigate();

  const goToPlay = () => navigate("/play");

  return (
    <div className="route-selection-container">
      <h2>Select Your Route</h2>
      <button onClick={goToPlay}>Thika Road Express</button>
      <button onClick={goToPlay}>Jogoo Road Pulse</button>
    </div>
  );
}

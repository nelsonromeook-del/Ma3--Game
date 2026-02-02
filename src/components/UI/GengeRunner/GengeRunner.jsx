import { useNavigate } from "react-router-dom";

export default function GengeRunner() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>GENGE RUNNER 🏃‍♂️</h1>
      <button onClick={() => navigate("/routes")} style={{ padding: "10px 20px", fontSize: "18px", cursor: "pointer" }}>
        Start Game
      </button>
    </div>
  );
}

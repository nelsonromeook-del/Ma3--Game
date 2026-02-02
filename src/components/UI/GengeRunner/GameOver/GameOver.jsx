import './GameOver.css';

export default function GameOver() {
  return (
    <div className="game-over-container">
      <h1>AJALI!</h1>
      <p>NGORI BUDA HATUFIKI TAO</p>
      <button onClick={() => window.location.href = "/"}>BACK TO MENU</button>
    </div>
  );
}

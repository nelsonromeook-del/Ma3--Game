export default function GameOver({ stats, onRetry }) {
  const isAjali = stats.revenueLost > 0;

  return (
    <div className="game-over-screen">
      <div className="panel">
        <h1 className="ajali">AJALI!</h1>
        
        <p className="subtitle">NGORI BUDA HATUFIKI TAO</p>

        <div className="revenue-section">
          <div className="revenue-title">REVENUE LOST</div>
          <div className="revenue-amount">Ksh {stats.revenueLost}</div>
        </div>

        <div className="stats">
          <div>Fare: Ksh {stats.fare}</div>
          <div>Level: {stats.level}</div>
          <div>Squad: {stats.squad}</div>
        </div>

        <button className="retry-btn" onClick={onRetry}>
          RETRY MENU
        </button>
      </div>
    </div>
  );
}
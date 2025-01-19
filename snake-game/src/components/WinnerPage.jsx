import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/WinnerPage.css';

const WinnerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { player1Name, player2Name, player1Score, player2Score, winner } = location.state || {};

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="winner-container">
      <h1>🎉 ¡Felicidades, {playerName}! 🎉</h1>
      <p>{player1Name}: {player1Score} puntos</p>
      <p>{player2Name}: {player2Score} puntos</p>
      <div className="button-group">
        <button onClick={handleRestart} className="restart-button">Volver al Inicio</button>
        <button onClick={handleViewRanking} className="ranking-button">Ver Rankings</button>
      </div>
    </div>
  );
};

export default WinnerPage;

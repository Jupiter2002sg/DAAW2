import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/GameOver.css';

const GameOver = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Datos pasados desde GameBoard
  const { player1Name, player2Name, player1Score, player2Score } = location.state || {};

  const goToRanking = () => {
    navigate('/scoreboard');
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="gameover-container">
      <h1>¡GAME OVER!</h1>
      <div>
        <h2>Resultados</h2>
        <h3>{player1Name}: {player1Score} puntos</h3>
        <h3>{player2Name}: {player2Score} puntos</h3>
      </div>
      <div className="button-group">
        <button className="ranking-button" onClick={goToRanking}>
          Ver Ranking
        </button>
        <button className="home-button" onClick={goToHome}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default GameOver;

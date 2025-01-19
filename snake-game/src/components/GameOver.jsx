import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/GameOver.css';

const GameOver = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Datos pasados desde GameBoard
  const { score, mode, player1Score, player2Score } = location.state || {
    score: 0,
    mode: 'single',
    player1Score: null,
    player2Score: null,
  };

  const goToRanking = () => {
    // Redirige a la página de ranking
    navigate('/scoreboard');
  };
  

  return (
    <div className="gameover-container">
      <h1>¡GAME OVER!</h1>
      {mode === 'single' ? (
        <div>
          <h2>Modo: Un Jugador</h2>
          <h3>Puntaje: {score}</h3>
        </div>
      ) : (
        <div>
          <h2>Modo: Dos Jugadores</h2>
          <h3>Jugador 1: {player1Score}</h3>
          <h3>Jugador 2: {player2Score}</h3>
        </div>
      )}
      <button className="ranking-button" onClick={goToRanking}>
        Ver Ranking
      </button>
      <button className="ranking-button" onClick={goToRanking}>
        Volver al inicio
      </button>
    </div>
  );
};

export default GameOver;

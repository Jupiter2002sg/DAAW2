import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/GameOver.css';

const GameOver = () => {
  const location = useLocation();
  const { name, score } = location.state || {};
  const player1 = JSON.parse(localStorage.getItem('player1'));

  return (
    <div className="gameover-container">
      <h1>¡Game Over!</h1>
      <h2>Lo siento, {name}</h2>
      <h3>Tu puntuación: {score}</h3>
      <h3>Jugador 1: {player1?.name || 'Desconocido'}, Puntuación: {player1?.score || 0}</h3>
      <button onClick={() => navigate('/')}>Volver al Inicio</button>
      <button onClick={() => navigate('/scoreboard')}>Ver Ranking</button>
    </div>
  );
}

export default GameOver;

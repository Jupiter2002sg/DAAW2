import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/WinnerPage.css';

const WinnerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, score } = location.state || {};
  const player2 = JSON.parse(localStorage.getItem('player2'));

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="winner-container">
      <h1>¡Felicidades, {name}!</h1>
      <h2>Tu puntuación: {score}</h2>
      <h3>Jugador 2: {player2?.name || 'Desconocido'}, Puntuación: {player2?.score || 0}</h3>
      <button onClick={() => navigate('/')}>Volver al Inicio</button>
      <button onClick={() => navigate('/scoreboard')}>Ver Ranking</button>
    </div>
  );
};

export default WinnerPage;

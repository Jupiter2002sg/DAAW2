import React from 'react';
import { useLocation } from 'react-router-dom';
import '../css/WinnerPage.css';

const WinnerPage = () => {
  const location = useLocation();
  const { playerName, score } = location.state || {};

  return (
    <div className="winner-container">
      <h1>¡Felicidades, {playerName}!</h1>
      <p>Has ganado con un puntaje de {score}.</p>
      <button onClick={() => window.location.reload()}>Volver a Jugar</button>
    </div>
  );
};

export default WinnerPage;

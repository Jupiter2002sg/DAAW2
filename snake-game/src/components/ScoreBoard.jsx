import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/ScoreBoard.css'; // Asegúrate de que este archivo existe

const ScoreBoard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Datos del puntaje recibidos al redirigir
  const { score, mode } = location.state || { score: 0, mode: 'single' };

  const handleRestart = () => {
    // Redirige a la página de inicio
    navigate('/');
  };

  return (
    <div className="scoreboard-container">
      <h1>¡GAME OVER!</h1>
      <p>Modo: {mode === 'single' ? 'Un Jugador' : 'Dos Jugadores'}</p>
      <h2>Tu Puntaje: {score}</h2>
      <button onClick={handleRestart}>Volver al Inicio</button>
    </div>
  );
};

export default ScoreBoard;

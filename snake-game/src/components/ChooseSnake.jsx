import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ref, set } from 'firebase/database';
import { db } from '../base';
import '../css/ChooseSnake.css';

const ChooseSnake = () => {
  const navigate = useNavigate();
  const playerName = localStorage.getItem('playerName');

  // Si no se recibe el nombre del jugador, redirige a Home
  if (!playerName) {
    alert('Error: No se encontró el nombre del jugador.');
    navigate('/'); // Redirige a la página de inicio
    return null;
  }

  // Maneja la selección de serpiente
  const handleSnakeSelection = async (snake) => {
    try {
      // Guarda la selección de la serpiente en Firebase
      await set(ref(db, `players/${snake}`), { name: playerName });

      // Navega al tablero del juego
      navigate(`/${snake}`);
    } catch (error) {
      console.error('Error al guardar la selección de serpiente:', error);
      alert('Ocurrió un error al guardar tu selección. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="choose-snake-container">
      <h1>{playerName}, elige tu Serpiente</h1>
      <button className="snake-button green" onClick={() => handleSnakeSelection('snake1')}>
        Jugar como Snake 1
      </button>
      <button className="snake-button blue" onClick={() => handleSnakeSelection('snake2')}>
        Jugar como Snake 2
      </button>
    </div>
  );
};

export default ChooseSnake;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createScore } from '../service/ApiSnakeGame'; 
import '../css/Home.css';

const Home = () => {
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const handleNameSubmit = async () => {
    if (!playerName.trim()) {
      alert('Por favor, introduce tu nombre.');
      return;
    }

    try {
      localStorage.setItem('playerName', playerName);
      await createScore(playerName, 0);
      navigate('/choose-snake', { state: { playerName } });
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al guardar tu nombre.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNameSubmit(); 
    }
  };

  return (
    <div className="home-container">
      <h1>Bienvenido al Snake Game 🐍 </h1>
      <h2>Introduce tu nombre:</h2>
      <input
        type="text"
        placeholder="Tu nombre"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        onKeyDown={handleKeyDown}
        className="home-input"
      />
      <button onClick={handleNameSubmit}>Continuar</button>
    </div>
  );
};

export default Home;

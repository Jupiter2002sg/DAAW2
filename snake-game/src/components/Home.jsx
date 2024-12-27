import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handlePlaySingle = () => {
    navigate('/single-player');
  };

  const handlePlaySnake1 = () => {
    navigate('/snake1');
  };

  const handlePlaySnake2 = () => {
    navigate('/snake2');
  };

  return (
    <div className="home-container">
      <h1>Snake Game</h1>
      <p>Elige una opción para empezar:</p>
      <div className="button-group">
        <button className="snake-button single" onClick={handlePlaySingle}>
          Jugar Solo
        </button>
        <button className="snake-button green" onClick={handlePlaySnake1}>
          Jugar como Snake 1
        </button>
        <button className="snake-button blue" onClick={handlePlaySnake2}>
          Jugar como Snake 2
        </button>
      </div>
    </div>
  );
};

export default Home;

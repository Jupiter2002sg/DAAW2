import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRanking } from '../service/ApiSnakeGame'; // Importa la función de la API
import '../css/ScoreBoard.css';

const ScoreBoard = () => {
  const [ranking, setRanking] = useState([]); // Estado para almacenar los puntajes
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const data = await getRanking(); 
        setRanking(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Ocurrió un error al cargar el ranking.');
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  const handleRestart = () => {
    navigate('/'); // Redirige a la página de inicio
  };

  if (loading) {
    return <p>Cargando ranking...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="scoreboard-container">
      <h1>Ranking</h1>
      <ol>
        {ranking.map((player, index) => (
          <li key={index}>
            {index + 1}. {player.name}: {player.score} puntos
          </li>
        ))}
      </ol>
      <button onClick={handleRestart}>Volver al Inicio</button>
    </div>
  );
};

export default ScoreBoard;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../service/ApiService';
import '../css/GameOverDoble.css';

const GameOverDoble = ({ player1, player2, score1, score2, onRestart }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const updateScores = async () => {
            try {
                // Actualizamos las puntuaciones de ambos jugadores
                await ApiService.createOrUpdateScore(player1, score1);
                await ApiService.createOrUpdateScore(player2, score2);
            } catch (err) {
                setError('Error al actualizar las puntuaciones.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        updateScores();
    }, [player1, player2, score1, score2]);

    if (loading) return <div className="gameover-container">Actualizando puntuaciones...</div>;
    if (error) return <div className="gameover-container">{error}</div>;

    return (
        <div className="gameover-container">
            <h1>Game Over</h1>
            <div className="results">
                <h2>Resultados</h2>
                <table className="results-table">
                    <thead>
                        <tr>
                            <th>Jugador</th>
                            <th>Puntuación</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{player1}</td>
                            <td>{score1}</td>
                        </tr>
                        <tr>
                            <td>{player2}</td>
                            <td>{score2}</td>
                        </tr>
                    </tbody>
                </table>
                <h3>
                    {score1 > score2
                        ? `${player1} gana! 🎉`
                        : score1 < score2
                        ? `${player2} gana! 🎉`
                        : '¡Es un empate! 🤝'}
                </h3>
            </div>
            <div className="buttons">
                <button onClick={onRestart}>Reiniciar</button>
                <button onClick={() => navigate('/ranking')}>Ver Ranking</button>
            </div>
        </div>
    );
};

export default GameOverDoble;

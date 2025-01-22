import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../service/ApiService';
import '../css/GameOverDoble.css';

const GameOverDoble = ({ player1, player2, onRestart }) => {
    const navigate = useNavigate();
    const [scores, setScores] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                // Obtener las puntuaciones de ambos jugadores desde la API
                const score1 = await ApiService.getScoresByPlayer(player1);
                const score2 = await ApiService.getScoresByPlayer(player2);

                // Guardar los resultados en el estado
                setScores({
                    [player1]: score1,
                    [player2]: score2,
                });
            } catch (err) {
                setError('Error al obtener las puntuaciones.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchScores();
    }, [player1, player2]);

    if (loading) return <div className="gameover-container">Cargando puntuaciones...</div>;
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
                            <th>Puntuación Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{player1}</td>
                            <td>{scores[player1]}</td>
                        </tr>
                        <tr>
                            <td>{player2}</td>
                            <td>{scores[player2]}</td>
                        </tr>
                    </tbody>
                </table>
                <h3>
                    {scores[player1] > scores[player2]
                        ? `${player1} gana! 🎉`
                        : scores[player1] < scores[player2]
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

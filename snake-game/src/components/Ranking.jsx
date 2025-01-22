import React, { useEffect, useState } from 'react';
import ApiService from '../service/ApiService';
import '../css/Ranking.css';

const Ranking = () => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const data = await ApiService.getRanking();
                setScores(data);
            } catch (err) {
                setError('Error al cargar el ranking.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRanking();
    }, []);

    if (loading) return <p>Cargando ranking...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="ranking-container">
            <h1>Ranking de Jugadores</h1>
            {scores.length > 0 ? (
                <table className="ranking-table">
                    <thead>
                        <tr>
                            <th>Posición</th>
                            <th>Jugador</th>
                            <th>Puntuación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((score, index) => (
                            <tr key={score.id}>
                                <td>{index + 1}</td>
                                <td>{score.playerName}</td>
                                <td>{score.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="no-data">No hay datos en el ranking.</p>
            )}
        </div>
    );
};

export default Ranking;

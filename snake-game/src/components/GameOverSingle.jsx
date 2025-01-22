// src/components/GameOverSingle.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ApiService from '../service/ApiService';
import '../css/GameOverSingle.css';

const GameOverSingle = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { score } = location.state || { score: 0 };
    const playerName = localStorage.getItem('playerName');

    useEffect(() => {
        const updateScore = async () => {
            try {
                await ApiService.createOrUpdateScore(playerName, score);
            } catch (error) {
                console.error('Error al actualizar el score:', error);
            }
        };

        updateScore();
    }, [playerName, score]);

    return (
        <div className="gameover-container">
            <h1>¡Game Over!</h1>
            <p>Jugador: <strong>{playerName}</strong></p>
            <p>Tu puntuación: <strong>{score}</strong></p>
            <div className="gameover-buttons">
                <button onClick={() => navigate('/single')}>Reiniciar Juego</button>
                <button onClick={() => navigate('/ranking')}>Ver Ranking</button>
            </div>
        </div>
    );
};

export default GameOverSingle;

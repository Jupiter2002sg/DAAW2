// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../service/ApiService';
import '../css/Login.css';

const Login = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (name.trim() === '') {
            alert('Por favor, ingresa tu nombre.');
            return;
        }

        try {
            // Llamar a la API para crear o actualizar el usuario con score inicial de 0
            await ApiService.createOrUpdateScore(name, 0);

            // Guardar el nombre del jugador en localStorage
            localStorage.setItem('playerName', name);

            // Redirigir a la página principal
            navigate('/home');
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Hubo un error al iniciar sesión. Por favor, inténtalo de nuevo.');
        }
    };


    return (
        <div className="login-container">
            <h2>Bienvenido al Snake Game</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Ingresa tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button type="submit">Continuar</button>
            </form>
        </div>
    );
};

export default Login;

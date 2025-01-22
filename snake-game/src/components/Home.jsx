// src/components/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h2>Bienvenido al Snake Game</h2>
            <button className="btn-solo" onClick={() => navigate('/single')}>Jugar Solo</button>
            <button className="btn-snake1" onClick={() => navigate('/snake1')}>Jugar como Snake1</button>
            <button className="btn-snake2" onClick={() => navigate('/snake2')}>Jugar como Snake2</button>
        </div>
    );
};

export default Home;

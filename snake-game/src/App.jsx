// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import SingleBoard from './components/SingleBoard';
import GameBoard from './components/GameBoard';
import Login from './components/Login';
import Ranking from './components/Ranking';
import GameOverSingle from './components/GameOverSingle';
import GameOverDoble from './components/GameOverDoble';
import './css/App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/single" element={<SingleBoard />} />
                    <Route path="/gameoversingle" element={<GameOverSingle />} />
                    <Route path="/snake1" element={<GameBoard player="snake1" />} />
                    <Route path="/snake2" element={<GameBoard player="snake2" />} />
                    <Route path="/gameoverdoble" element={<GameOverDoble />} />
                    <Route path="/ranking" element={<Ranking />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

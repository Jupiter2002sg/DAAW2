import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameBoard from './components/GameBoard';
import ScoreBoard from './components/ScoreBoard';
import './css/App.css';

function App() {
    return (
        <div className="App">
            <h1>Snake Game</h1>
            <Router>
                <Routes>
                    <Route path="/snake1" element={<GameBoard player={'snake1'} />} />
                    <Route path="/snake2" element={<GameBoard player={'snake2'} />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;

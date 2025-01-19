import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import GameBoard from './components/GameBoard';
import ScoreBoard from './components/ScoreBoard';
import GameOver from './components/GameOver';
import WinnerPage from './components/WinnerPage';
import Home from './components/Home';
import ChooseSnake from './components/ChooseSnake';
import './css/App.css';

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/single-player" element={<GameBoard mode="single" />} />
                    <Route path="/snake1" element={<GameBoard player={'snake1'} />} />
                    <Route path="/snake2" element={<GameBoard player={'snake2'} />} />
                    <Route path="/scoreboard" element={<ScoreBoard />} />
                    <Route path="/gameover" element={<GameOver />} />
                    <Route path="/winnerpage" element={<WinnerPage />} />
                    <Route path="/choose-snake" element={<ChooseSnake />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;

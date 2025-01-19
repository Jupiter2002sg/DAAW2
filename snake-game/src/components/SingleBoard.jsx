import React, { useState, useEffect } from 'react';
import { ref, set, onValue, remove } from "firebase/database"; 
import { db } from "../base"; 
import '../css/SingleBoard.css';

const boardSize = 10;
const initialSnake = [{ x: 2, y: 2 }];
const initialFood = { x: 5, y: 5 };

const SingleBoard = () => {
    const [snake, setSnake] = useState(initialSnake);
    const [food, setFood] = useState(initialFood);
    const [direction, setDirection] = useState({ x: 1, y: 0 });
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [userName, setUserName] = useState('');
    const [isGameStarted, setIsGameStarted] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    setDirection({ x: 0, y: -1 });
                    break;
                case 'ArrowDown':
                    setDirection({ x: 0, y: 1 });
                    break;
                case 'ArrowLeft':
                    setDirection({ x: -1, y: 0 });
                    break;
                case 'ArrowRight':
                    setDirection({ x: 1, y: 0 });
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (gameOver || !isGameStarted) return;

        const moveSnake = () => {
            const newSnake = [...snake];
            const head = newSnake[0];
            const newHead = { x: head.x + direction.x, y: head.y + direction.y };

            // Check for collisions
            if (
                newHead.x < 0 ||
                newHead.y < 0 ||
                newHead.x >= boardSize ||
                newHead.y >= boardSize ||
                newSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
            ) {
                setGameOver(true);
                saveScoreToDatabase();
                return;
            }

            newSnake.unshift(newHead);

            // Check for food
            if (newHead.x === food.x && newHead.y === food.y) {
                setFood({
                    x: Math.floor(Math.random() * boardSize),
                    y: Math.floor(Math.random() * boardSize)
                });
                setScore(score + 1);
            } else {
                newSnake.pop();
            }

            setSnake(newSnake);
        };

        const interval = setInterval(moveSnake, 200);
        return () => clearInterval(interval);
    }, [snake, direction, food, gameOver, isGameStarted]);

     // Guardar el puntaje en Firebase
     const saveScoreToDatabase = () => {
        if (!userName) return;
        const playerRef = ref(db, `scores/${userName}`);
        set(playerRef, { score });
    };

    return (
        <div className="board-container">
            {!isGameStarted ? (
                <div className="start-menu">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <button
                        onClick={() => {
                            if (userName.trim() === '') {
                                alert('Please enter a name to start the game.');
                                return;
                            }
                            setIsGameStarted(true);
                        }}
                    >
                        Start Game
                    </button>
                </div>
            ) : (
                <div className="board">
                    {Array.from({ length: boardSize }).map((_, row) =>
                        Array.from({ length: boardSize }).map((_, col) => (
                            <div
                                key={`${row}-${col}`}
                                className={`cell ${
                                    snake.some(segment => segment.x === col && segment.y === row)
                                        ? 'snake'
                                        : food.x === col && food.y === row
                                        ? 'food'
                                        : ''
                                }`}
                            />
                        ))
                    )}
                    {gameOver && <div className="game-over">Game Over</div>}
                </div>
            )}
            <div className="score-board">
                <h2>{userName ? `Player: ${userName}` : 'Player: N/A'}</h2>
                <h2>Score: {score}</h2>
            </div>
        </div>
    );
};


export default SingleBoard;

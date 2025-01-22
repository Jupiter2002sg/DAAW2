import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

    const navigate = useNavigate();

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
        if (gameOver) {
            // Redirigir a la pantalla GameOverSingle con el score actual
            navigate('/gameoversingle', { state: { score } });
            return;
        }

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
                return;
            }

            newSnake.unshift(newHead);

            // Check for food
            if (newHead.x === food.x && newHead.y === food.y) {
                setScore(prevScore => prevScore + 1);
                setFood({
                    x: Math.floor(Math.random() * boardSize),
                    y: Math.floor(Math.random() * boardSize)
                });
            } else {
                newSnake.pop();
            }

            setSnake(newSnake);
        };

        const interval = setInterval(moveSnake, 200);
        return () => clearInterval(interval);
    }, [snake, direction, food, gameOver, score, navigate]);

    return (
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
        </div>
    );
};

export default SingleBoard;

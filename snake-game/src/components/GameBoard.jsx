import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/GameBoard.css';

const boardSize = 10;
const initialSnake = [{ x: 2, y: 2 }];
const initialFood = { x: 5, y: 5 };

const GameBoard = ({ mode, player }) => {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0); // Puntaje del jugador

  const navigate = useNavigate();

  const isSinglePlayer = mode === 'single';

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver) {
      // Redirigir a la página de puntaje cuando el juego termine
      navigate('/scoreboard', { state: { score, mode: isSinglePlayer ? 'single' : 'multi' } });
      return;
    }

    const moveSnake = () => {
      const newSnake = [...snake];
      const head = newSnake[0];
      const newHead = { x: head.x + direction.x, y: head.y + direction.y };

      // Colisiones
      if (
        newHead.x < 0 ||
        newHead.y < 0 ||
        newHead.x >= boardSize ||
        newHead.y >= boardSize ||
        newSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameOver(true);
        return;
      }

      newSnake.unshift(newHead);

      // Comer comida
      if (newHead.x === food.x && newHead.y === food.y) {
        setFood({
          x: Math.floor(Math.random() * boardSize),
          y: Math.floor(Math.random() * boardSize),
        });
        setScore((prev) => prev + 10); // Incrementar el puntaje
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [snake, direction, food, gameOver, navigate, score]);

  return (
    <div className="game-container">
      <div className="board">
        {Array.from({ length: boardSize }).map((_, row) =>
          Array.from({ length: 10 }).map((_, col) => (
            <div
              key={`${row}-${col}`}
              className={`cell ${
                snake.some((segment) => segment.x === col && segment.y === row)
                  ? 'snake1'
                  : food.x === col && food.y === row
                  ? 'food'
                  : ''
              }`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, set, onValue } from 'firebase/database';
import { db } from '../base';
import '../css/GameBoard.css';

const boardSize = 10; 
const initialFood = { x: 5, y: 5 }; 

const GameBoard = ({ player, player1Name, player2Name }) => {
  const navigate = useNavigate();
  const [snakes, setSnakes] = useState({
    SNAKE1: [{ x: 2, y: 2 }],
    SNAKE2: [{ x: 7, y: 7 }],
  });
  const [food, setFood] = useState(initialFood);
  const [directions, setDirections] = useState({
    SNAKE1: { x: 1, y: 0 },
    SNAKE2: { x: -1, y: 0 },
  });
  const [gameOver, setGameOver] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const isSnake1 = player === 'snake1';
  const currentSnakeKey = isSnake1 ? 'SNAKE1' : 'SNAKE2';
  const enemySnakeKey = isSnake1 ? 'SNAKE2' : 'SNAKE1';

  const playerName = localStorage.getItem('playerName');

  // Registrar conexión del jugador en Firebase
  useEffect(() => {
    const playerRef = ref(db, `players/${player}`);
    set(playerRef, { connected: true });

    // Escuchar cambios en las conexiones de ambos jugadores
    const connectionRef = ref(db, 'players');
    const unsubscribe = onValue(connectionRef, (snapshot) => {
      const players = snapshot.val();
      const bothConnected = players?.snake1?.connected && players?.snake2?.connected;
      setIsWaiting(!bothConnected);
    });

    // Limpiar referencia del jugador al salir
    return () => set(playerRef, { connected: false });
  }, [player]);

  // Inicializar el estado del juego en Firebase
  useEffect(() => {
    if (isSnake1) {
      set(ref(db, 'game'), {
        snakes: {
          SNAKE1: snakes.SNAKE1,
          SNAKE2: snakes.SNAKE2,
        },
        food: initialFood,
        gameOver: false,
      });
    }
  }, [isSnake1]);

  // Escuchar cambios en Firebase para sincronizar el estado
  useEffect(() => {
    const gameRef = ref(db, 'game');
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSnakes(data.snakes || snakes);
        setFood(data.food || food);
        setGameOver(data.gameOver || false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const newDirection = { ...directions[currentSnakeKey] };
      switch (e.key) {
        case 'ArrowUp':
          if (newDirection.y === 0) newDirection.x = 0, newDirection.y = -1;
          break;
        case 'ArrowDown':
          if (newDirection.y === 0) newDirection.x = 0, newDirection.y = 1;
          break;
        case 'ArrowLeft':
          if (newDirection.x === 0) newDirection.x = -1, newDirection.y = 0;
          break;
        case 'ArrowRight':
          if (newDirection.x === 0) newDirection.x = 1, newDirection.y = 0;
          break;
        default:
          return;
      }
      setDirections((prev) => ({
        ...prev,
        [currentSnakeKey]: newDirection,
      }));
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentSnakeKey, directions]);

  useEffect(() => {
    if (gameOver || isWaiting) return;

    const moveSnake = (snakeKey) => {
      const currentSnake = snakes[snakeKey];
      const direction = directions[snakeKey];
      const newSnake = [...currentSnake];
      const head = newSnake[0];
      const newHead = { x: head.x + direction.x, y: head.y + direction.y };
      
      // Colisiones
      if (
        newHead.x < 0 ||
        newHead.y < 0 ||
        newHead.x >= boardSize ||
        newHead.y >= boardSize ||
        newSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y) ||
        snakes[enemySnakeKey].some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        set(ref(db, 'game/gameOver'), true); // Actualizar gameOver en Firebase
        return null;
      }

      newSnake.unshift(newHead);

      // Comer comida
      if (newHead.x === food.x && newHead.y === food.y) {
        const newFood = {
          x: Math.floor(Math.random() * boardSize),
          y: Math.floor(Math.random() * boardSize),
        };
        setFood(newFood);
        set(ref(db, 'game/food'), newFood); // Actualizar comida en Firebase
      } else {
        newSnake.pop();
      }

      set(ref(db, `game/snakes/${snakeKey}`), newSnake); // Actualizar serpiente en Firebase
      return newSnake;
    };

    const interval = setInterval(() => {
      setSnakes((prev) => ({
        SNAKE1: moveSnake('SNAKE1') || prev.SNAKE1,
        SNAKE2: moveSnake('SNAKE2') || prev.SNAKE2,
      }));
    }, 400);

    return () => clearInterval(interval);
  }, [snakes, directions, food, gameOver, enemySnakeKey, isWaiting]);

  // Escuchar gameOver para cerrar conexiones y redirigir
  useEffect(() => {
    if (gameOver) {
      const score1 = snakes.SNAKE1.length - 1;
      const score2 = snakes.SNAKE2.length - 1;

      // Guardar puntuación en Firebase
      set(ref(db, `scores/${player}`), {
        name: playerName,
        score: currentSnakeKey === 'SNAKE1' ? score1 : score2,
      });

      // Limpiar conexiones
      set(ref(db, `players/snake1`), { connected: false });
      set(ref(db, `players/snake2`), { connected: false });

      navigate('/gameoverdoble', {
        state: {
          player1: player1Name,
          player2: player2Name,
          score1,
          score2,
        },
      });
    }
  }, [gameOver, navigate, player1Name, player2Name, snakes, playerName, currentSnakeKey]);

  // Mostrar mensaje de espera
  if (isWaiting) {
    return (
      <div className="waiting-message">
        <h2>Esperando a ambos jugadores...</h2>
      </div>
    );
  }

  // Renderizar el tablero
  return (
    <div className="board">
      {Array.from({ length: boardSize }).map((_, row) =>
        Array.from({ length: boardSize }).map((_, col) => (
          <div
            key={`${row}-${col}`}
            className={`cell ${
              snakes.SNAKE1.some((segment) => segment.x === col && segment.y === row)
                ? 'snake1'
                : snakes.SNAKE2.some((segment) => segment.x === col && segment.y === row)
                ? 'snake2'
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

export default GameBoard;

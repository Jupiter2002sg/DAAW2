import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, ref, set, onValue } from "../firebaseConfig";
import "../css/GameBoard.css";


const boardSize = 10;

const GameBoard = ({ player }) => {
  const navigate = useNavigate();
  const playerName = localStorage.getItem('playerName') || "Jugador"; // Leer nombre desde localStorage
  const [gameState, setGameState] = useState(null); // Estado global del juego
  const [currentSnakeKey, setCurrentSnakeKey] = useState(null); // Determina si este jugador es SNAKE1 o SNAKE2

  // Detectar si el jugador es SNAKE1 o SNAKE2
  useEffect(() => {
    const gameRef = ref(db, 'game');
    const playerRef = ref(db, 'game/players');

    onValue(playerRef, (snapshot) => {
      const players = snapshot.val();

      if (!players?.SNAKE1?.connected) {
        // Si SNAKE1 no está conectado, asignar este jugador como SNAKE1
        setCurrentSnakeKey('SNAKE1');
        set(ref(db, 'game/players/SNAKE1'), {
          connected: true,
          name: playerName,
          snake: [{ x: 2, y: 2 }],
          direction: { x: 1, y: 0 },
          score: 0,
        });
      } else if (!players?.SNAKE2?.connected) {
        // Si SNAKE2 no está conectado, asignar este jugador como SNAKE2
        setCurrentSnakeKey('SNAKE2');
        set(ref(db, 'game/players/SNAKE2'), {
          connected: true,
          name: playerName,
          snake: [{ x: 7, y: 7 }],
          direction: { x: -1, y: 0 },
          score: 0,
        });
      } else {
        // Si ambos jugadores están conectados, este jugador no puede unirse
        alert("El juego ya está lleno.");
        navigate('/');
      }
    });

    // Escuchar cambios en el estado del juego
    const unsubscribeGame = onValue(gameRef, (snapshot) => {
      setGameState(snapshot.val());
    });

    // Limpiar el jugador al salir
    return () => {
      if (currentSnakeKey) {
        remove(ref(db, `game/players/${currentSnakeKey}`));
      }
    };
  }, [playerName, navigate, currentSnakeKey]);

  // Manejar eventos de teclado
  const handleKeyDown = (e) => {
    if (!gameState || gameState.status !== 'playing') return;

    const newDirection =
      e.key === 'ArrowUp'
        ? { x: 0, y: -1 }
        : e.key === 'ArrowDown'
        ? { x: 0, y: 1 }
        : e.key === 'ArrowLeft'
        ? { x: -1, y: 0 }
        : e.key === 'ArrowRight'
        ? { x: 1, y: 0 }
        : null;

    if (newDirection && currentSnakeKey) {
      update(ref(db, `game/players/${currentSnakeKey}`), { direction: newDirection });
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentSnakeKey]);

  // Mover serpientes en intervalos
  useEffect(() => {
    if (!gameState || gameState.status !== 'playing') return;

    const interval = setInterval(() => {
      const updatedPlayers = { ...gameState.players };

      Object.keys(updatedPlayers).forEach((snakeKey) => {
        const snake = updatedPlayers[snakeKey].snake;
        const direction = updatedPlayers[snakeKey].direction;
        const newHead = {
          x: snake[0].x + direction.x,
          y: snake[0].y + direction.y,
        };

        // Colisiones
        const isCollision =
          newHead.x < 0 ||
          newHead.y < 0 ||
          newHead.x >= boardSize ||
          newHead.y >= boardSize ||
          snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y) ||
          updatedPlayers[currentSnakeKey === 'SNAKE1' ? 'SNAKE2' : 'SNAKE1'].snake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          );

        if (isCollision) {
          set(ref(db, 'game/status'), 'gameOver');
          clearInterval(interval);
          return;
        }

        // Comer comida
        const isEatingFood = newHead.x === gameState.food.x && newHead.y === gameState.food.y;
        if (isEatingFood) {
          updatedPlayers[snakeKey].score += 1;
          set(ref(db, 'game/food'), {
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize),
          });
        } else {
          snake.pop();
        }

        snake.unshift(newHead);
      });

      update(ref(db, 'game/players'), updatedPlayers);
    }, 200);

    return () => clearInterval(interval);
  }, [gameState, currentSnakeKey]);

  // Redirigir cuando el juego termine
  useEffect(() => {
    if (gameState && gameState.status === 'gameOver') {
      navigate('/gameoverdoble', {
        state: {
          score1: gameState.players.SNAKE1.score,
          score2: gameState.players.SNAKE2.score,
        },
      });
    }
  }, [gameState, navigate]);

  // Mostrar mensaje de espera
  if (!gameState || gameState.status === 'waiting') {
    return <h2>Esperando a ambos jugadores...</h2>;
  }

  // Renderizar el tablero
  return (
    <div className="board">
      {Array.from({ length: boardSize }).map((_, row) =>
        Array.from({ length: boardSize }).map((_, col) => (
          <div
            key={`${row}-${col}`}
            className={`cell ${
              gameState.players.SNAKE1.snake.some((segment) => segment.x === col && segment.y === row)
                ? 'snake1'
                : gameState.players.SNAKE2.snake.some((segment) => segment.x === col && segment.y === row)
                ? 'snake2'
                : gameState.food.x === col && gameState.food.y === row
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


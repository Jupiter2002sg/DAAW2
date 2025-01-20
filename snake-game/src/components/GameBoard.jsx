import React, { useState, useEffect } from 'react';
import { ref, set, onValue } from "firebase/database";
import { db } from "../base"; 
import '../css/GameBoard.css';

const boardSize = 10;
const initialSnake1 = [{ x: 2, y: 2 }];
const initialSnake2 = [{ x: 7, y: 7 }];
const initialFood = { x: 5, y: 5 };

const GameBoard = ({ player }) => {
  const [snake1, setSnake1] = useState(initialSnake1);
  const [snake2, setSnake2] = useState(initialSnake2);
  const [food, setFood] = useState(initialFood);
  const [direction1, setDirection1] = useState({ x: 0, y: 0 });
  const [direction2, setDirection2] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [isBothPlayersConnected, setIsBothPlayersConnected] = useState(false);

  // Sincronizar estado inicial en Firebase
  useEffect(() => {
    const initialState = {
      snake1: initialSnake1,
      snake2: initialSnake2,
      food: initialFood,
      direction1: { x: 0, y: 0 },
      direction2: { x: 0, y: 0 },
      status: 'waiting',
    };
    set(ref(db, 'gameState'), initialState);
  }, []);

  // Manejar conexión de jugadores
  useEffect(() => {
    const playerRef = ref(db, `players/${player}`);
    set(playerRef, { connected: true });

    const connectionRef = ref(db, 'players');
    const unsubscribe = onValue(connectionRef, (snapshot) => {
      const players = snapshot.val();
      setIsBothPlayersConnected(players?.snake1?.connected && players?.snake2?.connected);
      if (players?.snake1?.connected && players?.snake2?.connected) {
        set(ref(db, 'gameState/status'), 'playing');
      }
    });

    return () => set(playerRef, { connected: false });
  }, [player]);

  // Escuchar el estado del juego
  useEffect(() => {
    const gameStateRef = ref(db, 'gameState');
    const unsubscribe = onValue(gameStateRef, (snapshot) => {
      const state = snapshot.val();
      if (state) {
        setSnake1(state.snake1);
        setSnake2(state.snake2);
        setFood(state.food);
        setDirection1(state.direction1);
        setDirection2(state.direction2);
        if (state.status === 'finished') setGameOver(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // Manejar teclas de movimiento
  useEffect(() => {
    const handleKeyDown = (e) => {
      let newDirection;
      if (player === 'snake1') {
        newDirection =
          e.key === 'ArrowUp'
            ? { x: 0, y: -1 }
            : e.key === 'ArrowDown'
            ? { x: 0, y: 1 }
            : e.key === 'ArrowLeft'
            ? { x: -1, y: 0 }
            : e.key === 'ArrowRight'
            ? { x: 1, y: 0 }
            : null;
        if (newDirection) set(ref(db, 'gameState/direction1'), newDirection);
      } else if (player === 'snake2') {
        newDirection =
          e.key === 'w'
            ? { x: 0, y: -1 }
            : e.key === 's'
            ? { x: 0, y: 1 }
            : e.key === 'a'
            ? { x: -1, y: 0 }
            : e.key === 'd'
            ? { x: 1, y: 0 }
            : null;
        if (newDirection) set(ref(db, 'gameState/direction2'), newDirection);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [player]);

  // Mover serpientes
  useEffect(() => {
    if (isBothPlayersConnected && !gameOver) {
      const interval = setInterval(() => {
        set(ref(db, 'gameState'), (prevState) => {
          const newState = { ...prevState };

          // Mover Snake1
          const newHead1 = {
            x: prevState.snake1[0].x + prevState.direction1.x,
            y: prevState.snake1[0].y + prevState.direction1.y,
          };

          // Mover Snake2
          const newHead2 = {
            x: prevState.snake2[0].x + prevState.direction2.x,
            y: prevState.snake2[0].y + prevState.direction2.y,
          };

          // Verificar colisiones
          if (
            checkCollision(newHead1, prevState.snake1, prevState.snake2) ||
            checkCollision(newHead2, prevState.snake2, prevState.snake1)
          ) {
            newState.status = 'finished';
            set(ref(db, 'gameState'), newState);
            return newState;
          }

          // Actualizar Snake1
          newState.snake1.unshift(newHead1);
          if (newHead1.x !== prevState.food.x || newHead1.y !== prevState.food.y) {
            newState.snake1.pop();
          }

          // Actualizar Snake2
          newState.snake2.unshift(newHead2);
          if (newHead2.x !== prevState.food.x || newHead2.y !== prevState.food.y) {
            newState.snake2.pop();
          }

          // Generar nueva comida
          if (newHead1.x === prevState.food.x && newHead1.y === prevState.food.y) {
            newState.food = generateFood(newState.snake1, newState.snake2);
          }
          if (newHead2.x === prevState.food.x && newHead2.y === prevState.food.y) {
            newState.food = generateFood(newState.snake1, newState.snake2);
          }

          return newState;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isBothPlayersConnected, gameOver]);

  // Verificar colisiones
  const checkCollision = (head, snake, otherSnake) => {
    return (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= boardSize ||
      head.y >= boardSize ||
      snake.some((segment) => segment.x === head.x && segment.y === head.y) ||
      otherSnake.some((segment) => segment.x === head.x && segment.y === head.y)
    );
  };

  // Renderizar tablero
  return (
    <div className="game-container">
      {isBothPlayersConnected ? (
        <div className="board">
          {Array.from({ length: boardSize }).map((_, row) =>
            Array.from({ length: boardSize }).map((_, col) => (
              <div
                key={`${row}-${col}`}
                className={`cell ${
                  snake1.some((segment) => segment.x === col && segment.y === row)
                    ? 'snake1'
                    : snake2.some((segment) => segment.x === col && segment.y === row)
                    ? 'snake2'
                    : food.x === col && food.y === row
                    ? 'food'
                    : ''
                }`}
              />
            ))
          )}
        </div>
      ) : (
        <h2>Esperando a ambos jugadores...</h2>
      )}
    </div>
  );
};

export default GameBoard;

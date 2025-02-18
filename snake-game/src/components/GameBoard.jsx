import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, ref, set, onValue, remove  } from "../firebaseConfig";
import { getInitialGameState, boardSize, generateFood } from "../config";
import ApiService from '../service/ApiService';
import '../css/GameBoard.css';

const GameBoard = ({ player }) => {
  const [gameState, setGameState] = useState(getInitialGameState());
  const [isBothPlayersConnected, setIsBothPlayersConnected] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  const playerName = localStorage.getItem('playerName') || 'Jugador';

  // Inicializar el estado del juego en Firebase
  useEffect(() => {
    const gameStateRef = ref(db, 'gameState');
    const initialState = getInitialGameState();
    set(gameStateRef, initialState); 
    setGameState(initialState); 
  }, []);

  // Manejar la conexión del jugador en Firebase
  useEffect(() => {
    const playerRef = ref(db, `players/${player}`);
    set(playerRef, { connected: true, name: playerName, score: 0 });

    // Escuchar el estado de conexión de ambos jugadores
    const connectionRef = ref(db, 'players');
    const unsubscribe = onValue(connectionRef, (snapshot) => {
      const players = snapshot.val();
      const snake1Connected = players?.snake1?.connected || false;
      const snake2Connected = players?.snake2?.connected || false;

      setIsBothPlayersConnected(snake1Connected && snake2Connected);

      // Cambiar el estado del juego a "playing" si ambos están conectados
      if (snake1Connected && snake2Connected) {
        set(ref(db, 'gameState/status'), 'playing');
      }
    });

    // Eliminar conexión del jugador al salir
    return () => {
      remove(playerRef);
      unsubscribe();
    };
  }, [player]);

  // Escuchar los cambios en el estado del juego desde Firebase
  useEffect(() => {
    const gameStateRef = ref(db, 'gameState');
    const unsubscribe = onValue(gameStateRef, (snapshot) => {
      const state = snapshot.val();
      if (state) {
        setGameState(state);
      } else {
        console.error('Estado del juego inválido detectado en Firebase.');
      }
    });

    return () => unsubscribe();
  }, [player]);

   useEffect(() => {
    if (gameState?.status === 'finished') {
      const player1Score = gameState.snake1.length - 1;
      const player2Score = gameState.snake2.length - 1;

      const snake1Name = gameState.playerNames?.snake1 || "Jugador 1";
      const snake2Name = gameState.playerNames?.snake2 || "Jugador 2";

      // Guardar los puntajes y nombres en Firebase
      set(ref(db, `games`), {
        snake1: { name: snake1Name, score: player1Score },
        snake2: { name: snake2Name, score: player2Score },
      });

      if (snake1Name) {
        ApiService.createOrUpdateScore(snake1Name, player1Score)
          .catch((error) => console.error('Error al actualizar score de Snake1:', error));
      }
      if (snake2Name) {
        ApiService.createOrUpdateScore(snake2Name, player2Score)
          .catch((error) => console.error('Error al actualizar score de Snake2:', error));
      }

      // Redirigir a ambos jugadores al componente GameOverDoble
      navigate('/gameoverdoble', {
        state: {
          player1: { name: snake1Name, score: player1Score },
          player2: { name: snake2Name, score: player2Score },
        },
      });
    }
  }, [gameState?.status, navigate]);

  // Manejar las teclas de movimiento del jugador
  const handleKeyDown = (e) => {
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

    if (newDirection) {
      const directionKey = player === 'snake1' ? 'direction1' : 'direction2';
      set(ref(db, `gameState/${directionKey}`), newDirection);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lógica para mover las serpientes y verificar colisiones
  useEffect(() => {
    if (gameState?.status === 'playing') {
      const interval = setInterval(() => {
        setGameState((prev) => {
          const newState = { ...prev };

          // Validar que las serpientes están inicializadas correctamente
          if (
            !prev.snake1 || !prev.snake2 ||
            !Array.isArray(prev.snake1) || !Array.isArray(prev.snake2) ||
            prev.snake1.length === 0 || prev.snake2.length === 0
          ) {
            console.error('Error: Las serpientes no están inicializadas correctamente.');
            return prev;
          }

          // Movimiento de Snake1
          const newHead1 = {
            x: prev.snake1[0].x + prev.direction1.x,
            y: prev.snake1[0].y + prev.direction1.y,
          };

          // Movimiento de Snake2
          const newHead2 = {
            x: prev.snake2[0].x + prev.direction2.x,
            y: prev.snake2[0].y + prev.direction2.y,
          };

          // Verificar colisiones
          const snake1Collision = checkCollision(newHead1, prev.snake1, prev.snake2);
          const snake2Collision = checkCollision(newHead2, prev.snake2, prev.snake1);

          if (snake1Collision || snake2Collision) {
            set(ref(db, 'gameState/status'), 'finished');
            return prev;
          }

          // Actualizar posiciones
          newState.snake1.unshift(newHead1);
          newState.snake1.pop();

          newState.snake2.unshift(newHead2);
          newState.snake2.pop();

          // Comida
          if (newHead1.x === prev.food.x && newHead1.y === prev.food.y) {
            const lastSegment1 = newState.snake1[newState.snake1.length - 1];
            newState.snake1.push({...lastSegment1 });
            newState.food = generateFood(newState.snake1, newState.snake2);
          }

          if (newHead2.x === prev.food.x && newHead2.y === prev.food.y) {
            const lastSegment2 = newState.snake2[newState.snake2.length - 1];
            newState.snake2.push({...lastSegment2 });
            newState.food = generateFood(newState.snake1, newState.snake2);
          }

          set(ref(db, 'gameState'), newState); // Sincronizar estado en Firebase
          return newState;
        });
      }, 600);

      return () => clearInterval(interval);
    }
  }, [gameState?.status]);

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

  // Renderizado del tablero
  return (
    <div className="game-container">
      {isBothPlayersConnected ? (
        <>
          <div 
            className="board">
            {Array.from({ length: boardSize }).map((_, row) =>
              Array.from({ length: boardSize }).map((_, col) => (
                <div
                  key={`${row}-${col}`}
                  className={`cell ${
                    gameState.snake1?.some((segment) => segment.x === col && segment.y === row)
                      ? 'snake1'
                      : gameState.snake2?.some((segment) => segment.x === col && segment.y === row)
                      ? 'snake2'
                      : gameState.food?.x === col && gameState.food?.y === row
                      ? 'food'
                      : ''
                  }`}
                />
              ))
            )}
          </div>
        </>
      ) : (
        <h2 className="waiting-message">Esperando a que ambos jugadores se conecten...</h2>
      )}
    </div>
  );
};

export default GameBoard;
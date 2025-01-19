import axios from 'axios';

// Configura la URL base de tu API
const api = axios.create({
  baseURL: 'https://0053-46-136-186-215.ngrok-free.app/snakegame-1/api/scores', 
});

// Función para obtener el ranking de puntuaciones
export const getRanking = async (limit = 5) => {
  const response = await api.get(`/ranking`);
  return response.data;
};

// Función para obtener el historial de un jugador
export const getPlayerScores = async (playerName) => {
  const response = await api.get(`/${playerName}`);
  return response.data;
};

// Función para crear un nuevo score
export const createScore = async (playerName, score) => {
  const response = await api.post('/create', { playerName, score });
  return response.data;
};

export default api;

// src/services/ApiService.js

const API_URL = "https://ce2c-84-88-201-58.ngrok-free.app/sankegame-1/api/scores";

const ApiService = {
    // Obtener todos los jugadores
    getAllScores: async () => {
        try {
            const response = await fetch(`${API_URL}/all`);
            if (!response.ok) {
                throw new Error("Error al obtener los scores");
            }
            return await response.json();
        } catch (error) {
            console.error("Error en getAllScores:", error);
            throw error;
        }
    },

    // Crear o actualizar el score de un jugador
    createOrUpdateScore: async (playerName, score) => {
        try {
            const response = await fetch(`${API_URL}/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ playerName, score }),
            });
            if (!response.ok) {
                throw new Error("Error al crear o actualizar el score");
            }
            return await response.json();
        } catch (error) {
            console.error("Error en createOrUpdateScore:", error);
            throw error;
        }
    },

    // Obtener los scores de un jugador específico
    getScoresByPlayer: async (playerName) => {
        try {
            const response = await fetch(`${API_URL}/${playerName}`);
            if (!response.ok) {
                throw new Error("Error al obtener los scores del jugador");
            }
            return await response.json();
        } catch (error) {
            console.error("Error en getScoresByPlayer:", error);
            throw error;
        }
    },

    // Obtener el ranking de los mejores scores
    getRanking: async () => {
        try {
            const response = await fetch(`${API_URL}/ranking`, {
                headers: {
                    Accept: "application/json", // Solicitar JSON explícitamente
                },
            });
            const contentType = response.headers.get("content-type");
    
            if (!response.ok) {
                const text = await response.text();
                console.error("Error HTTP. Respuesta:", text);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.warn("Respuesta no JSON:", text);
                return [];
            }
    
            return await response.json();
        } catch (error) {
            console.error("Error en getRanking:", error);
            return [];
        }
    },
    
    
};

export default ApiService;

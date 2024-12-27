import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ScoreBoard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5173/api/scores') 
      .then((response) => setScores(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h2>Ranking</h2>
      <ul>
        {scores.map((score, index) => (
          <li key={index}>
            {score.playerName}: {score.score}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ScoreBoard;

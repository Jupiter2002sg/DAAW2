

export const getInitialGameState = () => ({
  snake1: [{ x: 2, y: 2 }],
  snake2: [{ x: 7, y: 7 }],
  food: generateFood([{ x: 2, y: 2 }], [{ x: 7, y: 7 }]),
  direction1: { x: 0, y: 1 },
  direction2: { x: 0, y: -1 },
  status: "waiting",
});

export const generateFood = (snake1, snake2) => {
  let food;
  do {
    food = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize),
    };
  } while (
    snake1.some((segment) => segment.x === food.x && segment.y === food.y) ||
    snake2.some((segment) => segment.x === food.x && segment.y === food.y)
  );
  return food;
};

export const boardSize = 10;


// 贪吃蛇游戏逻辑
import { useCallback, useEffect, useState } from 'react';

// 定义游戏中使用的类型
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type Position = { x: number; y: number };
export type Snake = Position[];
export type GameStatus = 'READY' | 'PLAYING' | 'GAME_OVER';

// 游戏配置
export interface GameConfig {
  gridSize: number;     // 网格大小
  initialSnakeLength: number;  // 初始蛇的长度
  initialSpeed: number; // 初始游戏速度 (ms)
  speedIncrement: number; // 每吃一个食物增加的速度
}

// 默认游戏配置
export const DEFAULT_CONFIG: GameConfig = {
  gridSize: 20,
  initialSnakeLength: 3,
  initialSpeed: 150,
  speedIncrement: 5
};

// 方向键映射
export const KEY_MAPPING: Record<string, Direction> = {
  'ArrowUp': 'UP',
  'ArrowDown': 'DOWN',
  'ArrowLeft': 'LEFT',
  'ArrowRight': 'RIGHT',
  'w': 'UP',
  's': 'DOWN',
  'a': 'LEFT',
  'd': 'RIGHT',
};

// 方向与反方向的映射
const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  'UP': 'DOWN',
  'DOWN': 'UP',
  'LEFT': 'RIGHT',
  'RIGHT': 'LEFT'
};

// 计算下一个位置
export function getNextPosition(head: Position, direction: Direction, gridSize: number): Position {
  const newHead = { ...head };

  switch (direction) {
    case 'UP':
      newHead.y = (newHead.y - 1 + gridSize) % gridSize;
      break;
    case 'DOWN':
      newHead.y = (newHead.y + 1) % gridSize;
      break;
    case 'LEFT':
      newHead.x = (newHead.x - 1 + gridSize) % gridSize;
      break;
    case 'RIGHT':
      newHead.x = (newHead.x + 1) % gridSize;
      break;
  }

  return newHead;
}

// 检查是否自身碰撞
export function checkSelfCollision(snake: Snake): boolean {
  const [head, ...body] = snake;
  return body.some(segment => segment.x === head.x && segment.y === head.y);
}

// 生成随机食物位置
export function generateFood(snake: Snake, gridSize: number): Position {
  let position: Position;

  do {
    position = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
  } while (snake.some(segment => segment.x === position.x && segment.y === position.y));

  return position;
}

// 初始化蛇
export function initializeSnake(gridSize: number, length: number): Snake {
  const startX = Math.floor(gridSize / 2);
  const startY = Math.floor(gridSize / 2);

  const snake: Snake = [];
  for (let i = 0; i < length; i++) {
    snake.push({ x: startX, y: startY + i });
  }

  return snake;
}

// 使用自定义Hook管理游戏状态
export function useSnakeGame(config: GameConfig = DEFAULT_CONFIG) {
  const { gridSize, initialSnakeLength, initialSpeed, speedIncrement } = config;

  // 游戏状态
  const [snake, setSnake] = useState<Snake>([]);
  const [food, setFood] = useState<Position | null>(null);
  const [direction, setDirection] = useState<Direction>('UP');
  const [nextDirection, setNextDirection] = useState<Direction>('UP');
  const [gameStatus, setGameStatus] = useState<GameStatus>('READY');
  const [score, setScore] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(initialSpeed);

  // 初始化游戏
  const initGame = useCallback(() => {
    const initialSnake = initializeSnake(gridSize, initialSnakeLength);
    setSnake(initialSnake);
    setFood(generateFood(initialSnake, gridSize));
    setDirection('UP');
    setNextDirection('UP');
    setGameStatus('READY');
    setScore(0);
    setSpeed(initialSpeed);
  }, [gridSize, initialSnakeLength, initialSpeed]);

  // 开始游戏
  const startGame = useCallback(() => {
    if (gameStatus === 'READY') {
      setGameStatus('PLAYING');
    }
  }, [gameStatus]);

  // 游戏结束
  const endGame = useCallback(() => {
    setGameStatus('GAME_OVER');
  }, []);

  // 游戏重启
  const restartGame = useCallback(() => {
    initGame();
  }, [initGame]);

  // 处理方向改变
  const changeDirection = useCallback((newDirection: Direction) => {
    if (gameStatus !== 'PLAYING') return;

    // 防止180度转向
    if (OPPOSITE_DIRECTION[direction] !== newDirection) {
      setNextDirection(newDirection);
    }
  }, [direction, gameStatus]);

  // 处理键盘输入
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    const key = e.key;

    if (key === ' ' || key === 'Spacebar') {
      if (gameStatus === 'READY') startGame();
      else if (gameStatus === 'GAME_OVER') restartGame();
      return;
    }

    if (KEY_MAPPING[key]) {
      changeDirection(KEY_MAPPING[key]);
    }
  }, [gameStatus, startGame, restartGame, changeDirection]);

  // 游戏逻辑更新
  const updateGame = useCallback(() => {
    if (gameStatus !== 'PLAYING' || !food) return;

    // 更新当前方向
    setDirection(nextDirection);

    // 计算新的头部位置
    const head = snake[0];
    const newHead = getNextPosition(head, nextDirection, gridSize);

    // 检查是否吃到食物
    const ateFood = newHead.x === food.x && newHead.y === food.y;

    // 创建新的蛇身体
    let newSnake: Snake;
    if (ateFood) {
      // 吃到食物，蛇身体长度加一
      newSnake = [newHead, ...snake];
      // 生成新的食物
      setFood(generateFood(newSnake, gridSize));
      // 增加分数
      setScore(prevScore => prevScore + 1);
      // 增加速度
      setSpeed(prevSpeed => Math.max(prevSpeed - speedIncrement, 50));
    } else {
      // 没吃到食物，蛇身体长度不变
      newSnake = [newHead, ...snake.slice(0, -1)];
    }

    // 检查是否碰到自己
    if (checkSelfCollision(newSnake)) {
      endGame();
      return;
    }

    // 更新蛇的位置
    setSnake(newSnake);

  }, [snake, food, nextDirection, gameStatus, gridSize, endGame, speedIncrement]);

  // 初始化游戏
  useEffect(() => {
    initGame();
  }, [initGame]);

  // 设置键盘事件监听
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // 游戏主循环
  useEffect(() => {
    if (gameStatus !== 'PLAYING') return;

    const gameInterval = setInterval(updateGame, speed);
    return () => clearInterval(gameInterval);
  }, [gameStatus, updateGame, speed]);

  return {
    snake,
    food,
    direction,
    gameStatus,
    score,
    startGame,
    restartGame,
    changeDirection
  };
}

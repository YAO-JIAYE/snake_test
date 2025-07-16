
'use client';

import { useEffect, useRef } from 'react';
import { Position, Snake, useSnakeGame, Direction, GameStatus } from './useSnakeGame';

interface GameBoardProps {
  gridSize?: number;
  cellSize?: number;
}

export default function SnakeGame({ gridSize = 20, cellSize = 20 }: GameBoardProps) {
  const {
    snake,
    food,
    gameStatus,
    score,
    startGame,
    restartGame,
    changeDirection
  } = useSnakeGame({ gridSize, initialSnakeLength: 3, initialSpeed: 150, speedIncrement: 5 });

  const boardRef = useRef<HTMLDivElement>(null);

  // 处理触摸事件，用于移动设备上的操作
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (gameStatus !== 'PLAYING') return;

      e.preventDefault(); // 防止滚动

      const touchEndX = e.touches[0].clientX;
      const touchEndY = e.touches[0].clientY;

      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // 确定主要移动方向
      if (Math.abs(diffX) > Math.abs(diffY)) {
        // 水平移动
        if (diffX > 0) {
          changeDirection('RIGHT');
        } else {
          changeDirection('LEFT');
        }
      } else {
        // 垂直移动
        if (diffY > 0) {
          changeDirection('DOWN');
        } else {
          changeDirection('UP');
        }
      }

      touchStartX = touchEndX;
      touchStartY = touchEndY;
    };

    board.addEventListener('touchstart', handleTouchStart);
    board.addEventListener('touchmove', handleTouchMove);

    return () => {
      board.removeEventListener('touchstart', handleTouchStart);
      board.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gameStatus, changeDirection]);

  // 渲染蛇
  const renderSnake = () => {
    return snake.map((segment, index) => (
      <div
        key={`snake-${index}`}
        className={`absolute ${index === 0 ? 'bg-green-500' : 'bg-green-400'} rounded-sm`}
        style={{
          left: `${segment.x * cellSize}px`,
          top: `${segment.y * cellSize}px`,
          width: `${cellSize}px`,
          height: `${cellSize}px`,
          zIndex: 10,
        }}
      />
    ));
  };

  // 渲染食物
  const renderFood = () => {
    if (!food) return null;

    return (
      <div
        className="absolute bg-red-500 rounded-full"
        style={{
          left: `${food.x * cellSize}px`,
          top: `${food.y * cellSize}px`,
          width: `${cellSize}px`,
          height: `${cellSize}px`,
          zIndex: 5,
        }}
      />
    );
  };

  // 渲染网格（可选，用于视觉辅助）
  const renderGrid = () => {
    const grid = [];

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        grid.push(
          <div
            key={`grid-${x}-${y}`}
            className="absolute border border-gray-100 dark:border-gray-800"
            style={{
              left: `${x * cellSize}px`,
              top: `${y * cellSize}px`,
              width: `${cellSize}px`,
              height: `${cellSize}px`,
            }}
          />
        );
      }
    }

    return grid;
  };

  // 渲染控制按钮
  const renderControls = () => {
    return (
      <div className="mt-6 grid grid-cols-3 gap-2 w-full max-w-[300px]">
        {/* 上按钮 */}
        <div className="col-start-2">
          <button
            onClick={() => changeDirection('UP')}
            className="w-full bg-gray-200 dark:bg-gray-700 rounded-md py-3 flex items-center justify-center"
            aria-label="Move Up"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>

        {/* 左按钮 */}
        <div className="col-start-1 row-start-2">
          <button
            onClick={() => changeDirection('LEFT')}
            className="w-full bg-gray-200 dark:bg-gray-700 rounded-md py-3 flex items-center justify-center"
            aria-label="Move Left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* 右按钮 */}
        <div className="col-start-3 row-start-2">
          <button
            onClick={() => changeDirection('RIGHT')}
            className="w-full bg-gray-200 dark:bg-gray-700 rounded-md py-3 flex items-center justify-center"
            aria-label="Move Right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* 下按钮 */}
        <div className="col-start-2 row-start-3">
          <button
            onClick={() => changeDirection('DOWN')}
            className="w-full bg-gray-200 dark:bg-gray-700 rounded-md py-3 flex items-center justify-center"
            aria-label="Move Down"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold mb-2">贪吃蛇游戏</h1>
        <p className="text-lg">得分: <span className="font-bold">{score}</span></p>
      </div>

      <div 
        ref={boardRef}
        className="relative bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 overflow-hidden"
        style={{ 
          width: `${gridSize * cellSize}px`, 
          height: `${gridSize * cellSize}px` 
        }}
      >
        {/* 游戏网格 */}
        {renderGrid()}

        {/* 蛇和食物 */}
        {renderSnake()}
        {renderFood()}

        {/* 游戏状态覆盖层 */}
        {gameStatus !== 'PLAYING' && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-20">
            {gameStatus === 'READY' ? (
              <div className="text-center text-white">
                <h2 className="text-2xl font-bold mb-4">开始游戏</h2>
                <p className="mb-4">使用方向键或WASD控制蛇的移动</p>
                <button
                  onClick={startGame}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full"
                >
                  开始
                </button>
              </div>
            ) : (
              <div className="text-center text-white">
                <h2 className="text-2xl font-bold mb-4">游戏结束</h2>
                <p className="text-xl mb-4">得分: {score}</p>
                <button
                  onClick={restartGame}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full"
                >
                  重新开始
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 移动控制按钮 */}
      {renderControls()}

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>使用方向键或WASD控制蛇的移动</p>
        <p>在移动设备上可以通过触摸控制方向</p>
      </div>
    </div>
  );
}

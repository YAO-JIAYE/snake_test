
'use client';
import dynamic from 'next/dynamic';

// 使用动态导入避免SSR相关问题
const SnakeGame = dynamic(() => import('./game/SnakeGame'), { ssr: false });

export default function Home() {
  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
      <main className="w-full max-w-2xl flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 mt-4">贪吃蛇游戏</h1>
        <div className="w-full flex justify-center">
          <SnakeGame />
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>提示：使用键盘方向键或WASD控制蛇的移动</p>
          <p>按空格键开始或重新开始游戏</p>
        </div>
      </main>
      <footer className="mt-auto py-4 text-center text-sm text-gray-400">
        <p>贪吃蛇游戏 - 基于 Next.js 构建</p>
      </footer>
    </div>
  );
}


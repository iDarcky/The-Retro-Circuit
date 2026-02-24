'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GameState, getInitialState, getInitialRooms, processCommand, Room } from '@/lib/adventure/game';

export default function AdventureGame() {
  const [gameState, setGameState] = useState<GameState>(getInitialState());
  const [rooms, setRooms] = useState<Record<string, Room>>(getInitialRooms());
  const [input, setInput] = useState('');
  const logEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const { newState, newRooms } = processCommand(gameState, input, rooms);
    setGameState(newState);
    setRooms(newRooms);
    setInput('');
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameState.log]);

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto border border-gray-700 bg-black text-green-500 font-mono p-4 rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto mb-4 space-y-1">
        {gameState.log.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap break-words">
            {line}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <span className="select-none text-green-500">{'>'}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-green-500 focus:ring-0"
          placeholder="Type a command..."
          autoFocus
        />
      </form>
    </div>
  );
}

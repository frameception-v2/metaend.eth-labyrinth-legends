"use client";

import { useState } from "react";

export default function StartScreen() {
  const [isLoading, setIsLoading] = useState(false);
  
  async function startGame() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/start');
      const data = await response.json();
      // TODO: Handle game state with token (will be implemented in Task 6)
      console.log('Game started:', data.token);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="text-center">
      <h2 className="text-xl mb-4">HP: 100 | ATK: 10 | DEF: 5</h2>
      <button 
        onClick={startGame}
        disabled={isLoading}
        className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:opacity-50"
      >
        {isLoading ? 'Entering Dungeon...' : 'Enter Dungeon'}
      </button>
    </div>
  );
}

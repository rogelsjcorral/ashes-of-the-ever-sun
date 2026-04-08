'use client';

/**
 * The Main Game Console: Ashes of the Ever Sun
 * Copyright (C) 2026 Rogel S.J. Corral
 */

import React, { useState } from 'react';
import { useStore } from '@/lib/state/useStore';
import { rollD20 } from '@/lib/engine/dice';

export default function GamePage() {
  // 1. Pull state from our Zustand store
  const { player, location, updateHealth, updateLight } = useStore();
  
  // 2. Local UI state for the "Current Scene"
  const [narrative, setNarrative] = useState("The heavy iron doors of the Cathedral groan as you push them open. Outside, the sky is a bruised purple, devoid of the sun for a thousand years. You stand in the foyer, your small candle flickering against the draft.");
  const [isRolling, setIsRolling] = useState(false);

  // 3. Simple handler for actions (Dice Engine Demo)
  const handleAction = (label: string, dc: number) => {
    setIsRolling(true);
    
    // Roll the dice!
    const outcome = rollD20(player.willpower, dc);
    
    // Simulate a brief "suspense" pause before showing the result
    setTimeout(() => {
      if (outcome.isSuccess) {
        setNarrative(`[Success: Rolled ${outcome.total}] You successfully ${label.toLowerCase()}. The darkness recedes momentarily.`);
        updateLight(1); // Reward for success
      } else {
        setNarrative(`[Failure: Rolled ${outcome.total}] Your attempt to ${label.toLowerCase()} fails. The cold of Aurelune seeps into your bones.`);
        updateHealth(-2); // Penalty for failure
      }
      setIsRolling(false);
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#121212] text-[#e0e0e0] flex flex-col p-6 font-mono">
      
      {/* --- HEADER: Stats Bar --- */}
      <header className="flex justify-between border-b border-[#333] pb-4 mb-8">
        <div className="flex gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-orange-500">Health</span>
            <span className="text-xl font-bold">{player.health}/20</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-blue-400">Light</span>
            <span className="text-xl font-bold">{player.light}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-widest text-gray-500">Current Location</span>
          <div className="text-sm italic">{location}</div>
        </div>
      </header>

      {/* --- NARRATIVE WINDOW --- */}
      <section className="flex-grow max-w-2xl mx-auto flex flex-col justify-center">
        <div className={`transition-opacity duration-500 ${isRolling ? 'opacity-30' : 'opacity-100'}`}>
          <p className="text-lg leading-relaxed first-letter:text-4xl first-letter:font-bold first-letter:mr-2 first-letter:float-left">
            {narrative}
          </p>
        </div>
      </section>

      {/* --- INTERFACE: Choices --- */}
      <footer className="mt-12 flex flex-col items-center gap-4">
        {isRolling ? (
          <div className="animate-pulse text-orange-500">The dice are settling...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
            <button 
              onClick={() => handleAction("Search the debris", 12)}
              className="border border-[#444] p-4 hover:bg-orange-950/20 hover:border-orange-500 transition-all text-left"
            >
              <span className="text-xs text-gray-500 mr-2">DC 12</span> Search the debris
            </button>
            <button 
              onClick={() => handleAction("Light a secondary wick", 8)}
              className="border border-[#444] p-4 hover:bg-orange-950/20 hover:border-orange-500 transition-all text-left"
            >
              <span className="text-xs text-gray-500 mr-2">DC 08</span> Light a secondary wick
            </button>
          </div>
        )}
      </footer>

    </main>
  );
}

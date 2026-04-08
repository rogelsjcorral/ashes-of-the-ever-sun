'use client';

/**
 * The Main Game Console: Ashes of the Ever Sun
 * Copyright (C) 2026 Rogel S.J. Corral
 */

import React, { useState } from 'react';
import { useStore } from '@/lib/state/useStore';
import { rollD20 } from '@/lib/engine/dice';

export default function GamePage() {
  const { player, location, updateHealth, updateLight } = useStore();
  
  const [narrative, setNarrative] = useState("The heavy iron doors of the Cathedral groan as you push them open. Outside, the sky is a bruised purple, devoid of the sun for a thousand years.");
  const [isRolling, setIsRolling] = useState(false);
  
  // NEW: State to hold the dynamic choices sent by Gemini
  const [choices, setChoices] = useState([
    { label: "Search the debris", dc: 12 },
    { label: "Light a secondary wick", dc: 8 }
  ]);

  // UPDATED: The handler now talks to your route.ts bridge
  const handleAction = async (label: string, dc: number) => {
    if (isRolling) return;
    setIsRolling(true);
    
    const outcome = rollD20(player.willpower, dc);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: label,
          rollResult: `${outcome.type} (Total: ${outcome.total})`,
          stats: player,
          location: location
        }),
      });

      const data = await response.json();

      // Update the story and the new choices
      setNarrative(data.prose);
      if (data.choices) setChoices(data.choices);

      // Apply penalties/rewards based on the dice
      if (outcome.isSuccess) {
        updateLight(1);
      } else {
        updateHealth(-2);
        updateLight(-1);
      }

    } catch (error) {
      setNarrative("The ash chokes the connection. The darkness grows heavy.");
      console.error(error);
    } finally {
      setIsRolling(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#121212] text-[#e0e0e0] flex flex-col p-6 font-mono">
      
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

      <section className="flex-grow max-w-2xl mx-auto flex flex-col justify-center">
        <div className={`transition-opacity duration-500 ${isRolling ? 'opacity-30' : 'opacity-100'}`}>
          <p className="text-lg leading-relaxed first-letter:text-4xl first-letter:font-bold first-letter:mr-2 first-letter:float-left">
            {narrative}
          </p>
        </div>
      </section>

      <footer className="mt-12 flex flex-col items-center gap-4">
        {isRolling ? (
          <div className="animate-pulse text-orange-500">The dice are settling...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
            {/* UPDATED: Map through the dynamic choices from the AI */}
            {choices.map((choice, index) => (
              <button 
                key={index}
                onClick={() => handleAction(choice.label, choice.dc)}
                className="border border-[#444] p-4 hover:bg-orange-950/20 hover:border-orange-500 transition-all text-left"
              >
                <span className="text-xs text-gray-500 mr-2">DC {choice.dc.toString().padStart(2, '0')}</span> 
                {choice.label}
              </button>
            ))}
          </div>
        )}
      </footer>
    </main>
  );
}

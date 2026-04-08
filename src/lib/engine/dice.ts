/**
 * The Hand of Fate: Deterministic d20 Engine
 * Copyright (C) 2026 Rogel S.J. Corral
 */

export type RollResultType = 'Critical Success' | 'Success' | 'Failure' | 'Critical Failure';

export interface RollOutcome {
  roll: number;       // Raw 1-20
  modifier: number;   // Bonus from stats/willpower
  total: number;      // roll + modifier
  dc: number;         // Target Difficulty Class
  type: RollResultType;
  isSuccess: boolean;
}

/**
 * Standard d20 roll with critical hit/miss logic.
 * A natural 20 is always a Critical Success.
 * A natural 1 is always a Critical Failure.
 */
export const rollD20 = (modifier: number = 0, dc: number = 10): RollOutcome => {
  const roll = Math.floor(Math.random() * 20) + 1;
  const total = roll + modifier;
  
  let type: RollResultType = 'Success';
  let isSuccess = total >= dc;

  if (roll === 20) {
    type = 'Critical Success';
    isSuccess = true;
  } else if (roll === 1) {
    type = 'Critical Failure';
    isSuccess = false;
  } else if (total < dc) {
    type = 'Failure';
  }

  return { roll, modifier, total, dc, type, isSuccess };
};

/**
 * Utility for "Domestic Realism" checks.
 * Determines how much "Light" or "Sanity" is lost on failure.
 */
export const calculatePenalty = (type: RollResultType): number => {
  switch (type) {
    case 'Critical Failure': return 2;
    case 'Failure': return 1;
    default: return 0;
  }
};

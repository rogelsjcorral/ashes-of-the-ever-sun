import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GameState, PlayerStats, InventoryItem, Alignment } from '@/types';

/**
 * Zustand Store for Ashes of the Ever Sun
 * Implements persistence for PWA survival mechanics.
 */

interface GameActions {
  updateHealth: (amount: number) => void;
  updateLight: (amount: number) => void;
  addItem: (item: InventoryItem) => void;
  removeItem: (id: string) => void;
  setLocation: (location: string) => void;
  resetGame: () => void;
}

const initialStats: PlayerStats = {
  health: 20,
  sanity: 20,
  light: 10,
  willpower: 0,
};

export const useStore = create<GameState & GameActions>()(
  persist(
    (set) => ({
      // --- Initial State ---
      player: initialStats,
      inventory: [],
      location: 'The Ashen Gateway',
      alignment: 'Spark',
      dayCount: 1,
      isGameOver: false,

      // --- Actions ---
      updateHealth: (amount) => 
        set((state) => {
          const newHealth = Math.max(0, Math.min(20, state.player.health + amount));
          return { 
            player: { ...state.player, health: newHealth },
            isGameOver: newHealth <= 0 
          };
        }),

      updateLight: (amount) =>
        set((state) => ({
          player: { ...state.player, light: Math.max(0, state.player.light + amount) }
        })),

      addItem: (item) =>
        set((state) => ({
          inventory: [...state.inventory, item]
        })),

      removeItem: (id) =>
        set((state) => ({
          inventory: state.inventory.filter((item) => item.id !== id)
        })),

      setLocation: (location) => set({ location }),

      resetGame: () => set({ 
        player: initialStats, 
        inventory: [], 
        location: 'The Ashen Gateway', 
        isGameOver: false, 
        dayCount: 1 
      }),
    }),
    {
      name: 'aurelune-save-data', // The key in LocalStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

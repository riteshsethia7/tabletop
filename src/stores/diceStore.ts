import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getRandomInt } from '../utils/rng';
import { haptic } from '../utils/haptics';
import type { DiceType, DiceRoll } from '../types';

const DICE_SIDES: Record<DiceType, number> = {
  D2: 2,
  D4: 4,
  D6: 6,
  D8: 8,
  D10: 10,
  D12: 12,
  D20: 20,
  D30: 30,
  D100: 100,
};

interface DiceState {
  selectedDice: DiceType;
  count: number;
  results: number[];
  isRolling: boolean;
  history: DiceRoll[];

  selectDice: (dice: DiceType) => void;
  setCount: (count: number) => void;
  roll: () => void;
  clearHistory: () => void;
}

export const useDiceStore = create<DiceState>()(
  persist(
    (set, get) => ({
      selectedDice: 'D6',
      count: 1,
      results: [],
      isRolling: false,
      history: [],

      selectDice: (dice) => set({ selectedDice: dice }),

      setCount: (count) => set({ count: Math.max(1, Math.min(10, count)) }),

      roll: () => {
        const { selectedDice, count, history } = get();
        set({ isRolling: true });

        // Simulate rolling animation
        setTimeout(() => {
          const sides = DICE_SIDES[selectedDice];
          const results = Array.from({ length: count }, () =>
            getRandomInt(1, sides)
          );
          const total = results.reduce((sum, val) => sum + val, 0);

          const newRoll: DiceRoll = {
            id: `roll-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            diceType: selectedDice,
            count,
            results,
            total,
            timestamp: Date.now(),
          };

          // Keep only last 50 rolls
          const newHistory = [newRoll, ...history].slice(0, 50);

          set({
            results,
            isRolling: false,
            history: newHistory,
          });

          // Haptic feedback
          haptic.diceRoll();
        }, 300);
      },

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'playflow-dice',
      version: 1,
      partialize: (state) => ({
        selectedDice: state.selectedDice,
        count: state.count,
        history: state.history,
      }),
    }
  )
);

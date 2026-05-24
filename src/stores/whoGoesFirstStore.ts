import { create } from 'zustand';
import { getRandomInt } from '../utils/rng';
import { haptic } from '../utils/haptics';
import type { Touch } from '../types';

interface WhoGoesFirstState {
  touches: Touch[];
  locked: boolean;
  winner: number | null;

  setTouches: (touches: Touch[]) => void;
  lock: () => void;
  selectWinner: () => void;
  reset: () => void;
}

export const useWhoGoesFirstStore = create<WhoGoesFirstState>((set, get) => ({
  touches: [],
  locked: false,
  winner: null,

  setTouches: (touches) => set({ touches }),

  lock: () => {
    set({ locked: true });
    // Automatically select winner after lock
    setTimeout(() => {
      get().selectWinner();
    }, 500);
  },

  selectWinner: () => {
    const { touches } = get();
    if (touches.length === 0) return;

    const winnerIndex = getRandomInt(0, touches.length - 1);
    set({ winner: winnerIndex });

    // Celebration haptic
    haptic.celebration();
  },

  reset: () => set({ touches: [], locked: false, winner: null }),
}));

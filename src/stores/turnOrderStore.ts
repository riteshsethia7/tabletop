import { create } from 'zustand';
import { randomPermutation } from '../utils/shuffle';
import { haptic } from '../utils/haptics';
import type { Touch } from '../types';

interface TurnOrderState {
  touches: Touch[];
  order: number[];
  locked: boolean;

  setTouches: (touches: Touch[]) => void;
  generateOrder: () => void;
  reset: () => void;
}

export const useTurnOrderStore = create<TurnOrderState>((set, get) => ({
  touches: [],
  order: [],
  locked: false,

  setTouches: (touches) => set({ touches }),

  generateOrder: () => {
    const { touches } = get();
    if (touches.length === 0) return;

    set({ locked: true });

    // Generate random permutation for turn order
    const order = randomPermutation(touches.length);

    setTimeout(() => {
      set({ order });
      haptic.success();
    }, 500);
  },

  reset: () => set({ touches: [], order: [], locked: false }),
}));

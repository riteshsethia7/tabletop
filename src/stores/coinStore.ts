import { create } from 'zustand';
import { coinFlip } from '../utils/rng';
import { haptic } from '../utils/haptics';

type CoinResult = 'heads' | 'tails' | null;

interface CoinState {
  result: CoinResult;
  isFlipping: boolean;
  flip: () => void;
  reset: () => void;
}

export const useCoinStore = create<CoinState>((set) => ({
  result: null,
  isFlipping: false,

  flip: () => {
    set({ isFlipping: true, result: null });

    // Simulate flip animation duration
    setTimeout(() => {
      const result = coinFlip() ? 'heads' : 'tails';
      set({ result, isFlipping: false });

      // Haptic feedback on result
      haptic.coinFlip();
    }, 800); // 800ms flip animation
  },

  reset: () => set({ result: null, isFlipping: false }),
}));

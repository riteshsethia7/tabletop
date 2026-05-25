import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getRandomInt } from '../utils/rng';
import { haptic } from '../utils/haptics';
import type { WheelPreset } from '../types';

interface SpinWheelState {
  segments: string[];
  isSpinning: boolean;
  winner: string | null;
  rotation: number;
  presets: WheelPreset[];

  setSegments: (segments: string[]) => void;
  spin: () => void;
  reset: () => void;
  savePreset: (name: string) => void;
  loadPreset: (id: string) => void;
  deletePreset: (id: string) => void;
}

const DEFAULT_SEGMENTS = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

export const useSpinWheelStore = create<SpinWheelState>()(
  persist(
    (set, get) => ({
      segments: DEFAULT_SEGMENTS,
      isSpinning: false,
      winner: null,
      rotation: 0,
      presets: [],

      setSegments: (segments) => {
        const validSegments = segments.filter((s) => s.trim() !== '');
        if (validSegments.length >= 2) {
          set({ segments: validSegments });
        }
      },

      spin: () => {
        const { segments, rotation } = get();
        if (segments.length < 2) return;

        set({ isSpinning: true, winner: null });

        // Generate random final rotation
        const fullSpins = getRandomInt(5, 8) * 360;
        const randomAngle = getRandomInt(0, 359);
        const finalRotation = rotation + fullSpins + randomAngle;

        set({ rotation: finalRotation });

        // Calculate winner based on final rotation
        // The pointer is at top (270 degrees in our coordinate system)
        // After rotation, determine which segment is under the pointer
        const degreesPerSegment = 360 / segments.length;
        const normalizedRotation = finalRotation % 360;

        // Calculate which segment is at the pointer position (top = 270 degrees)
        // Segments are drawn starting from -90 degrees (top), going clockwise
        // After rotation, we need to find which segment is at 270 degrees
        const pointerAngle = 270; // Top of circle
        const segmentAtPointer = (pointerAngle - normalizedRotation + 90) % 360;
        const winnerIndex = Math.floor(segmentAtPointer / degreesPerSegment) % segments.length;
        const winner = segments[winnerIndex];

        // Complete spin after animation
        setTimeout(() => {
          set({ isSpinning: false, winner });
          haptic.celebration();
        }, 3000);
      },

      reset: () => set({ winner: null }),

      savePreset: (name) => {
        const { segments, presets } = get();
        const newPreset: WheelPreset = {
          id: `preset-${Date.now()}`,
          name,
          segments: [...segments],
        };
        set({ presets: [...presets, newPreset] });
      },

      loadPreset: (id) => {
        const { presets } = get();
        const preset = presets.find((p) => p.id === id);
        if (preset) {
          set({ segments: [...preset.segments], winner: null });
        }
      },

      deletePreset: (id) => {
        const { presets } = get();
        set({ presets: presets.filter((p) => p.id !== id) });
      },
    }),
    {
      name: 'playflow-spin-wheel',
      version: 1,
      partialize: (state) => ({
        presets: state.presets,
        segments: state.segments,
      }),
    }
  )
);

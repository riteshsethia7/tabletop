import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme, AccentColor, Settings } from '../types';

interface SettingsState extends Settings {
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
  setHaptics: (enabled: boolean) => void;
  setSound: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  setKeepAwake: (enabled: boolean) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  theme: 'system',
  accentColor: 'blue',
  haptics: true,
  sound: true,
  reducedMotion: false,
  keepAwake: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setHaptics: (haptics) => set({ haptics }),
      setSound: (sound) => set({ sound }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setKeepAwake: (keepAwake) => set({ keepAwake }),

      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'playflow-settings', // localStorage key
      version: 1,
    }
  )
);

/**
 * Get current effective theme (resolves 'system' to 'light' or 'dark')
 */
export function getEffectiveTheme(theme: Theme): 'light' | 'dark' {
  if (theme !== 'system') {
    return theme;
  }

  // Check system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  return 'light'; // Default fallback
}

/**
 * Get whether haptics should be triggered
 */
export function shouldVibrate(): boolean {
  return useSettingsStore.getState().haptics;
}

/**
 * Get whether sounds should be played
 */
export function shouldPlaySound(): boolean {
  return useSettingsStore.getState().sound;
}

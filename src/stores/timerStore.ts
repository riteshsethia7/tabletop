import { create } from 'zustand';
import { saveTimer, getTimer } from '../db';
import type { TimerState, PlayerTimer, TimerEvent } from '../types';

const TIMER_ID = 'current-timer';

interface TimerStoreState extends TimerState {
  timerSnapshots: PlayerTimer[][];
  setup: (players: number, timePerPlayer: number, autoAdvance: boolean) => Promise<void>;
  switchToPlayer: (playerId: number) => void;
  togglePause: () => void;
  reset: () => void;
  updateTimer: (playerId: number, timeRemaining: number) => void;
  undo: () => void;
  loadSavedTimer: () => Promise<void>;
  clearTimer: () => Promise<void>;
}

export const useTimerStore = create<TimerStoreState>((set, get) => ({
  id: TIMER_ID,
  players: 0,
  timePerPlayer: 0,
  activePlayer: 0,
  timers: [],
  isPaused: true,
  autoAdvance: false,
  history: [],
  startTime: null,
  timerSnapshots: [],

  setup: async (players, timePerPlayer, autoAdvance) => {
    const timers: PlayerTimer[] = Array.from({ length: players }, (_, i) => ({
      playerId: i,
      timeRemaining: timePerPlayer * 60 * 1000, // Convert minutes to ms
      isActive: i === 0,
    }));

    const newState: TimerState = {
      id: TIMER_ID,
      players,
      timePerPlayer,
      activePlayer: 0,
      timers,
      isPaused: false,
      autoAdvance,
      history: [],
      startTime: performance.now(),
    };

    await saveTimer(newState);
    set({ ...newState, timerSnapshots: [timers] }); // Initial snapshot
  },

  switchToPlayer: (playerId) => {
    const { timers, history } = get();

    // Update timers
    const updatedTimers = timers.map((timer) => ({
      ...timer,
      isActive: timer.playerId === playerId,
    }));

    // Add to history
    const event: TimerEvent = {
      type: 'switch',
      playerId,
      timestamp: Date.now(),
    };

    const newState = {
      activePlayer: playerId,
      timers: updatedTimers,
      history: [...history, event],
      isPaused: false,
      startTime: performance.now(),
    };

    set(newState);
    saveTimer({ ...get(), ...newState });
  },

  togglePause: () => {
    const { isPaused, timers, timerSnapshots } = get();
    const newPaused = !isPaused;

    // Create snapshot when pausing (stopping the timer)
    const newSnapshots = newPaused
      ? [...timerSnapshots, JSON.parse(JSON.stringify(timers))] // Deep copy
      : timerSnapshots;

    set({ isPaused: newPaused, timerSnapshots: newSnapshots });
    saveTimer({ ...get(), isPaused: newPaused });
  },

  reset: () => {
    const { players, timePerPlayer, autoAdvance } = get();
    if (players === 0) return;

    get().setup(players, timePerPlayer, autoAdvance);
  },

  undo: () => {
    const { timerSnapshots } = get();

    // Need at least 2 snapshots to undo (current + previous)
    if (timerSnapshots.length < 2) return;

    // Remove current snapshot and restore previous
    const newSnapshots = timerSnapshots.slice(0, -1);
    const previousTimers = newSnapshots[newSnapshots.length - 1];

    set({
      timers: JSON.parse(JSON.stringify(previousTimers)), // Deep copy
      timerSnapshots: newSnapshots,
      isPaused: true, // Keep paused after undo
    });

    saveTimer(get());
  },

  updateTimer: (playerId, timeRemaining) => {
    const { timers, autoAdvance } = get();

    const updatedTimers = timers.map((timer) =>
      timer.playerId === playerId ? { ...timer, timeRemaining } : timer
    );

    set({ timers: updatedTimers });

    // Auto-advance if time runs out
    if (timeRemaining <= 0 && autoAdvance) {
      const nextPlayer = (playerId + 1) % timers.length;
      setTimeout(() => get().switchToPlayer(nextPlayer), 500);
    }

    saveTimer({ ...get(), timers: updatedTimers });
  },

  loadSavedTimer: async () => {
    const saved = await getTimer(TIMER_ID);
    if (saved) {
      set({ ...saved, isPaused: true });
    }
  },

  clearTimer: async () => {
    set({
      id: TIMER_ID,
      players: 0,
      timePerPlayer: 0,
      activePlayer: 0,
      timers: [],
      isPaused: true,
      autoAdvance: false,
      history: [],
      startTime: null,
      timerSnapshots: [],
    });
  },
}));

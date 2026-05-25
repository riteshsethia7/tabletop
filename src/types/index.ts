// Theme Types
export type Theme = 'system' | 'light' | 'dark';
export type AccentColor = 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'teal' | 'amber';

// Settings Types
export interface Settings {
  theme: Theme;
  accentColor: AccentColor;
  haptics: boolean;
  sound: boolean;
  reducedMotion: boolean;
  keepAwake: boolean;
}

// Touch Types
export interface Touch {
  id: number;
  x: number;
  y: number;
  color: string;
}

// Dice Types
export type DiceType = 'D2' | 'D4' | 'D6' | 'D8' | 'D10' | 'D12' | 'D20' | 'D30' | 'D100';

export interface DiceRoll {
  id: string;
  diceType: DiceType;
  count: number;
  results: number[];
  total: number;
  timestamp: number;
}

// Team Types
export interface Team {
  id: string;
  name: string;
  color: string;
  players: Touch[];
}

// Score Tracker Types
export interface Player {
  id: string;
  name: string;
}

export interface Round {
  roundNumber: number;
  scores: { playerId: string; score: number }[];
}

export interface Game {
  id: string;
  name: string;
  players: Player[];
  rounds: Round[];
  lowestScoreWins?: boolean;
  createdAt: number;
  updatedAt: number;
}

// Timer Types
export interface PlayerTimer {
  playerId: number;
  timeRemaining: number;
  isActive: boolean;
}

export interface TimerEvent {
  type: 'start' | 'pause' | 'switch' | 'reset';
  playerId: number;
  timestamp: number;
}

export interface TimerState {
  id: string;
  players: number;
  timePerPlayer: number;
  activePlayer: number;
  timers: PlayerTimer[];
  isPaused: boolean;
  autoAdvance: boolean;
  history: TimerEvent[];
  startTime: number | null;
}

// Spin Wheel Types
export interface WheelPreset {
  id: string;
  name: string;
  segments: string[];
}

// Arena Types
export interface ArenaPlayer {
  id: string;
  name: string;
  wins: number;
  gamesPlayed: number;
}

export interface ArenaGame {
  id: string;
  gameName: string;
  winnerId: string;
  playedAt: number;
}

export interface Arena {
  id: string;
  name: string;
  players: ArenaPlayer[];
  games: ArenaGame[];
  createdAt: number;
}

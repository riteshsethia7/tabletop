import { create } from 'zustand';
import { saveGame, getGame, getAllGames, deleteGame as dbDeleteGame } from '../db';
import type { Game, Player, Round } from '../types';

interface ScoreState {
  currentGame: Game | null;
  games: Game[];
  isLoading: boolean;

  createGame: (name: string, playerNames: string[]) => Promise<void>;
  loadGame: (id: string) => Promise<void>;
  addPlayer: (name: string) => Promise<void>;
  removePlayer: (playerId: string) => Promise<void>;
  addRound: (scores: { playerId: string; score: number }[]) => Promise<void>;
  editRound: (roundIndex: number, scores: { playerId: string; score: number }[]) => Promise<void>;
  undoRound: () => Promise<void>;
  deleteGame: (id: string) => Promise<void>;
  loadAllGames: () => Promise<void>;
  clearCurrentGame: () => void;
}

export const useScoreStore = create<ScoreState>((set, get) => ({
  currentGame: null,
  games: [],
  isLoading: false,

  createGame: async (name, playerNames) => {
    const players: Player[] = playerNames.map((playerName, index) => ({
      id: `player-${index}-${Date.now()}`,
      name: playerName,
    }));

    const game: Game = {
      id: `game-${Date.now()}`,
      name,
      players,
      rounds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await saveGame(game);
    set({ currentGame: game });
    await get().loadAllGames();
  },

  loadGame: async (id) => {
    set({ isLoading: true });
    const game = await getGame(id);
    set({ currentGame: game || null, isLoading: false });
  },

  addPlayer: async (name) => {
    const { currentGame } = get();
    if (!currentGame) return;

    const newPlayer: Player = {
      id: `player-${currentGame.players.length}-${Date.now()}`,
      name,
    };

    const updatedGame: Game = {
      ...currentGame,
      players: [...currentGame.players, newPlayer],
      updatedAt: Date.now(),
    };

    await saveGame(updatedGame);
    set({ currentGame: updatedGame });
    await get().loadAllGames();
  },

  removePlayer: async (playerId) => {
    const { currentGame } = get();
    if (!currentGame) return;

    const updatedGame: Game = {
      ...currentGame,
      players: currentGame.players.filter((p) => p.id !== playerId),
      rounds: currentGame.rounds.map((round) => ({
        ...round,
        scores: round.scores.filter((s) => s.playerId !== playerId),
      })),
      updatedAt: Date.now(),
    };

    await saveGame(updatedGame);
    set({ currentGame: updatedGame });
    await get().loadAllGames();
  },

  addRound: async (scores) => {
    const { currentGame } = get();
    if (!currentGame) return;

    const newRound: Round = {
      roundNumber: currentGame.rounds.length + 1,
      scores,
    };

    const updatedGame: Game = {
      ...currentGame,
      rounds: [...currentGame.rounds, newRound],
      updatedAt: Date.now(),
    };

    await saveGame(updatedGame);
    set({ currentGame: updatedGame });
    await get().loadAllGames();
  },

  editRound: async (roundIndex, scores) => {
    const { currentGame } = get();
    if (!currentGame) return;

    const updatedRounds = [...currentGame.rounds];
    updatedRounds[roundIndex] = {
      ...updatedRounds[roundIndex],
      scores,
    };

    const updatedGame: Game = {
      ...currentGame,
      rounds: updatedRounds,
      updatedAt: Date.now(),
    };

    await saveGame(updatedGame);
    set({ currentGame: updatedGame });
    await get().loadAllGames();
  },

  undoRound: async () => {
    const { currentGame } = get();
    if (!currentGame || currentGame.rounds.length === 0) return;

    const updatedGame: Game = {
      ...currentGame,
      rounds: currentGame.rounds.slice(0, -1),
      updatedAt: Date.now(),
    };

    await saveGame(updatedGame);
    set({ currentGame: updatedGame });
    await get().loadAllGames();
  },

  deleteGame: async (id) => {
    await dbDeleteGame(id);
    const { currentGame } = get();
    if (currentGame?.id === id) {
      set({ currentGame: null });
    }
    await get().loadAllGames();
  },

  loadAllGames: async () => {
    const games = await getAllGames();
    set({ games });
  },

  clearCurrentGame: () => set({ currentGame: null }),
}));

// Calculate total scores for each player
export function calculateTotals(game: Game): { playerId: string; total: number }[] {
  const totals: Record<string, number> = {};

  game.players.forEach((player) => {
    totals[player.id] = 0;
  });

  game.rounds.forEach((round) => {
    round.scores.forEach((score) => {
      totals[score.playerId] = (totals[score.playerId] || 0) + score.score;
    });
  });

  return Object.entries(totals).map(([playerId, total]) => ({
    playerId,
    total,
  }));
}

// Get winner(s) - can be multiple in case of tie
export function getWinners(game: Game): Player[] {
  const totals = calculateTotals(game);
  const maxScore = Math.max(...totals.map((t) => t.total));
  const winnerIds = totals.filter((t) => t.total === maxScore).map((t) => t.playerId);
  return game.players.filter((p) => winnerIds.includes(p.id));
}

import { create } from 'zustand';
import { saveArena, getArena, getAllArenas, deleteArena as dbDeleteArena } from '../db';
import type { Arena, ArenaPlayer, ArenaGame } from '../types';

interface ArenaState {
  currentArena: Arena | null;
  arenas: Arena[];
  isLoading: boolean;

  createArena: (name: string, playerNames: string[]) => Promise<void>;
  loadArena: (id: string) => Promise<void>;
  addGame: (gameName: string, winnerId: string) => Promise<void>;
  deleteGame: (gameId: string) => Promise<void>;
  deleteArena: (id: string) => Promise<void>;
  loadAllArenas: () => Promise<void>;
  clearCurrentArena: () => void;
}

export const useArenaStore = create<ArenaState>((set, get) => ({
  currentArena: null,
  arenas: [],
  isLoading: false,

  createArena: async (name, playerNames) => {
    const players: ArenaPlayer[] = playerNames.map((playerName, index) => ({
      id: `player-${index}-${Date.now()}`,
      name: playerName,
      wins: 0,
      gamesPlayed: 0,
    }));

    const arena: Arena = {
      id: `arena-${Date.now()}`,
      name,
      players,
      games: [],
      createdAt: Date.now(),
    };

    await saveArena(arena);
    set({ currentArena: arena });
    await get().loadAllArenas();
  },

  loadArena: async (id) => {
    set({ isLoading: true });
    const arena = await getArena(id);
    set({ currentArena: arena || null, isLoading: false });
  },

  addGame: async (gameName, winnerId) => {
    const { currentArena } = get();
    if (!currentArena) return;

    const newGame: ArenaGame = {
      id: `game-${Date.now()}`,
      gameName,
      winnerId,
      playedAt: Date.now(),
    };

    // Update player stats
    const updatedPlayers = currentArena.players.map((player) => {
      if (player.id === winnerId) {
        return {
          ...player,
          wins: player.wins + 1,
          gamesPlayed: player.gamesPlayed + 1,
        };
      }
      return {
        ...player,
        gamesPlayed: player.gamesPlayed + 1,
      };
    });

    const updatedArena: Arena = {
      ...currentArena,
      players: updatedPlayers,
      games: [...currentArena.games, newGame],
    };

    await saveArena(updatedArena);
    set({ currentArena: updatedArena });
    await get().loadAllArenas();
  },

  deleteGame: async (gameId) => {
    const { currentArena } = get();
    if (!currentArena) return;

    const game = currentArena.games.find((g) => g.id === gameId);
    if (!game) return;

    // Revert player stats
    const updatedPlayers = currentArena.players.map((player) => {
      if (player.id === game.winnerId) {
        return {
          ...player,
          wins: Math.max(0, player.wins - 1),
          gamesPlayed: Math.max(0, player.gamesPlayed - 1),
        };
      }
      return {
        ...player,
        gamesPlayed: Math.max(0, player.gamesPlayed - 1),
      };
    });

    const updatedArena: Arena = {
      ...currentArena,
      players: updatedPlayers,
      games: currentArena.games.filter((g) => g.id !== gameId),
    };

    await saveArena(updatedArena);
    set({ currentArena: updatedArena });
    await get().loadAllArenas();
  },

  deleteArena: async (id) => {
    await dbDeleteArena(id);
    const { currentArena } = get();
    if (currentArena?.id === id) {
      set({ currentArena: null });
    }
    await get().loadAllArenas();
  },

  loadAllArenas: async () => {
    const arenas = await getAllArenas();
    set({ arenas });
  },

  clearCurrentArena: () => set({ currentArena: null }),
}));

// Get arena champion(s)
export function getChampions(arena: Arena): ArenaPlayer[] {
  const maxWins = Math.max(...arena.players.map((p) => p.wins));
  return arena.players.filter((p) => p.wins === maxWins && p.wins > 0);
}

import Dexie, { Table } from 'dexie';
import type { Game, TimerState, Arena } from '../types';

export class TableTopDB extends Dexie {
  games!: Table<Game, string>;
  timers!: Table<TimerState, string>;
  arenas!: Table<Arena, string>;

  constructor() {
    super('TableTopDB');

    this.version(1).stores({
      games: 'id, createdAt, updatedAt',
      timers: 'id',
      arenas: 'id, createdAt',
    });
  }
}

export const db = new TableTopDB();

// Helper functions for games
export async function saveGame(game: Game): Promise<string> {
  return await db.games.put(game);
}

export async function getGame(id: string): Promise<Game | undefined> {
  return await db.games.get(id);
}

export async function getAllGames(): Promise<Game[]> {
  return await db.games.orderBy('updatedAt').reverse().toArray();
}

export async function deleteGame(id: string): Promise<void> {
  await db.games.delete(id);
}

// Helper functions for timers
export async function saveTimer(timer: TimerState): Promise<string> {
  return await db.timers.put(timer);
}

export async function getTimer(id: string): Promise<TimerState | undefined> {
  return await db.timers.get(id);
}

export async function deleteTimer(id: string): Promise<void> {
  await db.timers.delete(id);
}

// Helper functions for arenas
export async function saveArena(arena: Arena): Promise<string> {
  return await db.arenas.put(arena);
}

export async function getArena(id: string): Promise<Arena | undefined> {
  return await db.arenas.get(id);
}

export async function getAllArenas(): Promise<Arena[]> {
  return await db.arenas.orderBy('createdAt').reverse().toArray();
}

export async function deleteArena(id: string): Promise<void> {
  await db.arenas.delete(id);
}

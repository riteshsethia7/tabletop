import { create } from 'zustand';
import { distributeToTeams } from '../utils/shuffle';
import { haptic } from '../utils/haptics';
import type { Touch, Team } from '../types';

// Colorblind-safe team colors
const TEAM_COLORS = [
  { name: 'Blue', color: '#2563eb', bg: 'bg-blue-500' },
  { name: 'Red', color: '#dc2626', bg: 'bg-red-500' },
  { name: 'Green', color: '#16a34a', bg: 'bg-green-500' },
  { name: 'Amber', color: '#f59e0b', bg: 'bg-amber-500' },
  { name: 'Purple', color: '#a855f7', bg: 'bg-purple-500' },
  { name: 'Teal', color: '#14b8a6', bg: 'bg-teal-500' },
];

interface TeamBuilderState {
  numTeams: number;
  touches: Touch[];
  teams: Team[];
  locked: boolean;

  setNumTeams: (num: number) => void;
  setTouches: (touches: Touch[]) => void;
  generateTeams: () => void;
  reset: () => void;
}

export const useTeamBuilderStore = create<TeamBuilderState>((set, get) => ({
  numTeams: 2,
  touches: [],
  teams: [],
  locked: false,

  setNumTeams: (num) => set({ numTeams: Math.max(2, Math.min(6, num)) }),

  setTouches: (touches) => set({ touches }),

  generateTeams: () => {
    const { touches, numTeams } = get();
    if (touches.length < numTeams) {
      // Not enough players for the selected number of teams
      return;
    }

    set({ locked: true });

    // Distribute touches into balanced teams
    const distributedTeams = distributeToTeams(touches, numTeams);

    // Map to Team objects with colors and names
    const teams: Team[] = distributedTeams.map((teamTouches, index) => ({
      id: `team-${index}`,
      name: TEAM_COLORS[index].name,
      color: TEAM_COLORS[index].color,
      players: teamTouches,
    }));

    setTimeout(() => {
      set({ teams });
      haptic.success();
    }, 500);
  },

  reset: () => set({ touches: [], teams: [], locked: false }),
}));

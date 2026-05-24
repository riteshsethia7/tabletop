import { describe, it, expect } from 'vitest';
import { shuffleArray, distributeToTeams } from '../shuffle';

describe('Shuffle Algorithm', () => {
  describe('shuffleArray', () => {
    it('should return an array of the same length', () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffleArray(input);
      expect(result).toHaveLength(input.length);
    });

    it('should contain all original elements', () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffleArray(input);
      
      for (const item of input) {
        expect(result).toContain(item);
      }
    });

    it('should not modify the original array', () => {
      const input = [1, 2, 3, 4, 5];
      const inputCopy = [...input];
      shuffleArray(input);
      expect(input).toEqual(inputCopy);
    });

    it('should produce different results (statistical test)', () => {
      const input = [1, 2, 3, 4, 5];
      const results = new Set<string>();
      
      // Run shuffle 100 times and collect unique results
      for (let i = 0; i < 100; i++) {
        const result = shuffleArray(input);
        results.add(JSON.stringify(result));
      }
      
      // Should have many different permutations
      expect(results.size).toBeGreaterThan(50);
    });

    it('should have roughly uniform distribution of permutations', () => {
      // Test that each position gets each element roughly equally
      const input = [1, 2, 3, 4];
      const iterations = 10000;
      const positionCounts: Map<number, Map<number, number>> = new Map();
      
      // Initialize counts
      for (let pos = 0; pos < input.length; pos++) {
        positionCounts.set(pos, new Map());
        for (const item of input) {
          positionCounts.get(pos)!.set(item, 0);
        }
      }
      
      // Run shuffles
      for (let i = 0; i < iterations; i++) {
        const result = shuffleArray(input);
        for (let pos = 0; pos < result.length; pos++) {
          const item = result[pos];
          const count = positionCounts.get(pos)!.get(item)!;
          positionCounts.get(pos)!.set(item, count + 1);
        }
      }
      
      // Check distribution (each item should appear in each position ~2500 times ± 30%)
      const expected = iterations / input.length;
      const tolerance = expected * 0.3; // 30% tolerance
      
      for (let pos = 0; pos < input.length; pos++) {
        for (const item of input) {
          const count = positionCounts.get(pos)!.get(item)!;
          expect(count).toBeGreaterThan(expected - tolerance);
          expect(count).toBeLessThan(expected + tolerance);
        }
      }
    });

    it('should work with empty array', () => {
      const result = shuffleArray([]);
      expect(result).toEqual([]);
    });

    it('should work with single element', () => {
      const result = shuffleArray([1]);
      expect(result).toEqual([1]);
    });

    it('should work with duplicate elements', () => {
      const input = [1, 1, 2, 2, 3];
      const result = shuffleArray(input);
      expect(result).toHaveLength(input.length);
      expect(result.filter(x => x === 1)).toHaveLength(2);
      expect(result.filter(x => x === 2)).toHaveLength(2);
      expect(result.filter(x => x === 3)).toHaveLength(1);
    });
  });

  describe('distributeToTeams', () => {
    it('should distribute players evenly across teams', () => {
      const players = Array.from({ length: 6 }, (_, i) => ({ id: i, name: `Player ${i}` }));
      const teams = distributeToTeams(players, 2);

      expect(teams).toHaveLength(2);
      expect(teams[0]).toHaveLength(3);
      expect(teams[1]).toHaveLength(3);
    });

    it('should handle uneven distribution', () => {
      const players = Array.from({ length: 7 }, (_, i) => ({ id: i, name: `Player ${i}` }));
      const teams = distributeToTeams(players, 3);

      expect(teams).toHaveLength(3);

      const teamSizes = teams.map(t => t.length).sort();
      // Should be [2, 2, 3] or similar distribution
      expect(Math.max(...teamSizes) - Math.min(...teamSizes)).toBeLessThanOrEqual(1);
    });

    it('should include all players exactly once', () => {
      const players = Array.from({ length: 10 }, (_, i) => ({ id: i, name: `Player ${i}` }));
      const teams = distributeToTeams(players, 3);

      const allTeamPlayers = teams.flat();
      expect(allTeamPlayers).toHaveLength(players.length);

      // Check each player appears exactly once
      for (const player of players) {
        const count = allTeamPlayers.filter(p => p.id === player.id).length;
        expect(count).toBe(1);
      }
    });

    it('should produce different distributions on multiple calls', () => {
      const players = Array.from({ length: 6 }, (_, i) => ({ id: i, name: `Player ${i}` }));
      const distributions = new Set<string>();

      for (let i = 0; i < 50; i++) {
        const teams = distributeToTeams(players, 2);
        const teamIds = teams.map(t => t.map(p => p.id).sort().join(',')).join('|');
        distributions.add(teamIds);
      }

      // Should have multiple different distributions
      expect(distributions.size).toBeGreaterThan(10);
    });
  });
});

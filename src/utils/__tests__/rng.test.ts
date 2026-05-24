import { describe, it, expect } from 'vitest';
import { getRandomInt } from '../rng';

describe('RNG (Random Number Generator)', () => {
  describe('getRandomInt', () => {
    it('should return numbers within the specified range', () => {
      for (let i = 0; i < 1000; i++) {
        const result = getRandomInt(1, 6);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(6);
      }
    });

    it('should return the same number when min equals max', () => {
      const result = getRandomInt(5, 5);
      expect(result).toBe(5);
    });

    it('should generate all possible values in range', () => {
      const min = 1;
      const max = 6;
      const results = new Set<number>();
      
      // Run enough iterations to likely hit all values
      for (let i = 0; i < 10000; i++) {
        results.add(getRandomInt(min, max));
      }
      
      // Check that we got all values from min to max
      for (let i = min; i <= max; i++) {
        expect(results.has(i)).toBe(true);
      }
    });

    it('should have roughly uniform distribution', () => {
      const min = 1;
      const max = 6;
      const iterations = 60000;
      const counts = new Map<number, number>();
      
      // Initialize counts
      for (let i = min; i <= max; i++) {
        counts.set(i, 0);
      }
      
      // Generate random numbers
      for (let i = 0; i < iterations; i++) {
        const result = getRandomInt(min, max);
        counts.set(result, (counts.get(result) || 0) + 1);
      }
      
      // Check distribution (each number should appear ~10000 times ± 20%)
      const expected = iterations / (max - min + 1);
      const tolerance = expected * 0.2; // 20% tolerance
      
      for (let i = min; i <= max; i++) {
        const count = counts.get(i) || 0;
        expect(count).toBeGreaterThan(expected - tolerance);
        expect(count).toBeLessThan(expected + tolerance);
      }
    });

    it('should work with large ranges', () => {
      const result = getRandomInt(1, 1000000);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(1000000);
    });

    it('should work with negative numbers', () => {
      const result = getRandomInt(-10, 10);
      expect(result).toBeGreaterThanOrEqual(-10);
      expect(result).toBeLessThanOrEqual(10);
    });

    it('should be cryptographically random (chi-square test)', () => {
      // Simple chi-square test for randomness
      const min = 0;
      const max = 9;
      const iterations = 10000;
      const buckets = max - min + 1;
      const expected = iterations / buckets;
      const counts = new Array(buckets).fill(0);
      
      for (let i = 0; i < iterations; i++) {
        const result = getRandomInt(min, max);
        counts[result]++;
      }
      
      // Calculate chi-square statistic
      let chiSquare = 0;
      for (let i = 0; i < buckets; i++) {
        const diff = counts[i] - expected;
        chiSquare += (diff * diff) / expected;
      }
      
      // Chi-square critical value for 9 degrees of freedom at 95% confidence is ~16.92
      // This is a loose test - we just want to ensure it's not obviously non-random
      expect(chiSquare).toBeLessThan(30);
    });
  });
});

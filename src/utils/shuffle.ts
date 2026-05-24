import { getRandomInt } from './rng';

/**
 * Fisher-Yates (Knuth) shuffle algorithm
 * Shuffles array in-place with O(n) complexity
 * Uses cryptographically secure random number generator
 *
 * @param array - Array to shuffle (will be modified in-place)
 * @returns The shuffled array (same reference as input)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]; // Create a copy to avoid mutating original

  for (let i = arr.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
  }

  return arr;
}

/**
 * Shuffle array and return a new array (immutable version)
 *
 * @param array - Array to shuffle
 * @returns New shuffled array
 */
export function shuffleArrayImmutable<T>(array: T[]): T[] {
  const arr = [...array];
  return shuffleArray(arr);
}

/**
 * Get a random permutation of numbers from 0 to n-1
 * Useful for generating random turn orders
 *
 * @param n - Number of elements
 * @returns Array of numbers from 0 to n-1 in random order
 */
export function randomPermutation(n: number): number[] {
  if (n <= 0) {
    throw new Error('n must be greater than 0');
  }

  const arr = Array.from({ length: n }, (_, i) => i);
  return shuffleArray(arr);
}

/**
 * Distribute items into teams using round-robin after shuffling
 * Ensures balanced team distribution
 *
 * @param items - Items to distribute
 * @param numTeams - Number of teams
 * @returns Array of teams, each containing items
 */
export function distributeToTeams<T>(items: T[], numTeams: number): T[][] {
  if (numTeams <= 0) {
    throw new Error('numTeams must be greater than 0');
  }

  if (numTeams > items.length) {
    throw new Error('numTeams cannot be greater than number of items');
  }

  const shuffled = shuffleArray(items);
  const teams: T[][] = Array.from({ length: numTeams }, () => []);

  shuffled.forEach((item, index) => {
    teams[index % numTeams].push(item);
  });

  return teams;
}

/**
 * Cryptographically secure random number generator
 * Uses Web Crypto API instead of Math.random() for fair randomness
 */

/**
 * Generate a random integer between min (inclusive) and max (inclusive)
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns Random integer between min and max
 */
export function getRandomInt(min: number, max: number): number {
  if (min > max) {
    throw new Error('min must be less than or equal to max');
  }

  const range = max - min + 1;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const maxValue = Math.pow(256, bytesNeeded);
  const randomBytes = new Uint8Array(bytesNeeded);

  let randomValue: number;
  do {
    crypto.getRandomValues(randomBytes);
    randomValue = randomBytes.reduce((acc, byte, i) => acc + byte * Math.pow(256, i), 0);
  } while (randomValue >= maxValue - (maxValue % range));

  return min + (randomValue % range);
}

/**
 * Generate a random float between 0 (inclusive) and 1 (exclusive)
 * @returns Random float between 0 and 1
 */
export function getRandomFloat(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] / (0xffffffff + 1);
}

/**
 * Pick a random element from an array
 * @param array - Array to pick from
 * @returns Random element from the array
 */
export function pickRandom<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error('Cannot pick from an empty array');
  }
  const index = getRandomInt(0, array.length - 1);
  return array[index];
}

/**
 * Generate a random boolean
 * @returns Random boolean
 */
export function coinFlip(): boolean {
  return getRandomInt(0, 1) === 1;
}

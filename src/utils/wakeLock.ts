/**
 * Wake Lock utility for preventing screen from sleeping
 * Useful for Timer and Arena features
 */

let wakeLock: WakeLockSentinel | null = null;

/**
 * Request wake lock to keep screen awake
 * Returns true if successful, false otherwise
 */
export async function requestWakeLock(): Promise<boolean> {
  // Check if Wake Lock API is supported
  if (!('wakeLock' in navigator)) {
    console.warn('Wake Lock API not supported');
    return false;
  }

  try {
    wakeLock = await navigator.wakeLock.request('screen');
    
    // Listen for wake lock release
    wakeLock.addEventListener('release', () => {
      console.log('Wake lock released');
    });

    console.log('Wake lock acquired');
    return true;
  } catch (err) {
    console.error('Failed to acquire wake lock:', err);
    return false;
  }
}

/**
 * Release wake lock to allow screen to sleep
 */
export async function releaseWakeLock(): Promise<void> {
  if (wakeLock) {
    try {
      await wakeLock.release();
      wakeLock = null;
      console.log('Wake lock manually released');
    } catch (err) {
      console.error('Failed to release wake lock:', err);
    }
  }
}

/**
 * Check if wake lock is currently active
 */
export function isWakeLockActive(): boolean {
  return wakeLock !== null && !wakeLock.released;
}

/**
 * Re-request wake lock when page becomes visible
 * Useful after tab switching or screen lock
 */
export function setupWakeLockReacquisition(): void {
  if ('wakeLock' in navigator) {
    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'visible' && wakeLock?.released) {
        await requestWakeLock();
      }
    });
  }
}

/**
 * Haptic feedback utilities using the Vibration API
 * Respects user settings and provides fallbacks for unsupported browsers
 */

/**
 * Check if vibration API is supported
 */
export function isVibrationSupported(): boolean {
  return 'vibrate' in navigator;
}

/**
 * Vibrate with a single duration or pattern
 * @param pattern - Duration in ms or array of durations [vibrate, pause, vibrate, ...]
 * @param checkSettings - Whether to check settings store (default: true)
 */
export function vibrate(
  pattern: number | number[],
  checkSettings: boolean = true
): void {
  if (!isVibrationSupported()) {
    return;
  }

  // Check settings if requested
  if (checkSettings) {
    // Lazy import to avoid circular dependencies
    import('../stores/settingsStore').then(({ shouldVibrate }) => {
      if (!shouldVibrate()) {
        return;
      }
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        console.warn('Vibration failed:', error);
      }
    });
    return;
  }

  try {
    navigator.vibrate(pattern);
  } catch (error) {
    console.warn('Vibration failed:', error);
  }
}

/**
 * Stop any ongoing vibration
 */
export function stopVibration(): void {
  if (isVibrationSupported()) {
    navigator.vibrate(0);
  }
}

// Predefined haptic patterns
export const HapticPatterns = {
  /** Single short tap (light feedback) */
  light: 10,

  /** Medium tap */
  medium: 25,

  /** Strong tap */
  strong: 50,

  /** Success pattern */
  success: [10, 50, 10],

  /** Error pattern */
  error: [50, 100, 50, 100, 50],

  /** Warning pattern */
  warning: [30, 50, 30],

  /** Selection pattern (like clicking a button) */
  selection: 15,

  /** Winner celebration pattern */
  celebration: [50, 100, 50, 100, 100, 200, 100],

  /** Dice roll pattern */
  diceRoll: [10, 30, 10, 30, 10],

  /** Coin flip pattern */
  coinFlip: [20, 80, 20],

  /** Timer alert pattern */
  timerAlert: [100, 200, 100, 200, 100],
};

/**
 * Convenience functions for common haptic patterns
 */
export const haptic = {
  light: () => vibrate(HapticPatterns.light),
  medium: () => vibrate(HapticPatterns.medium),
  strong: () => vibrate(HapticPatterns.strong),
  success: () => vibrate(HapticPatterns.success),
  error: () => vibrate(HapticPatterns.error),
  warning: () => vibrate(HapticPatterns.warning),
  selection: () => vibrate(HapticPatterns.selection),
  celebration: () => vibrate(HapticPatterns.celebration),
  diceRoll: () => vibrate(HapticPatterns.diceRoll),
  coinFlip: () => vibrate(HapticPatterns.coinFlip),
  timerAlert: () => vibrate(HapticPatterns.timerAlert),
  stop: stopVibration,
};

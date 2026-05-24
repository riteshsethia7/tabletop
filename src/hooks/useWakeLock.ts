import { useEffect } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import {
  requestWakeLock,
  releaseWakeLock,
  setupWakeLockReacquisition,
} from '../utils/wakeLock';

/**
 * Hook to manage wake lock lifecycle
 * Automatically requests/releases wake lock based on component mount and settings
 */
export function useWakeLock(enabled: boolean = true) {
  const keepAwake = useSettingsStore((state) => state.keepAwake);

  useEffect(() => {
    // Only request wake lock if both the setting is enabled and the component wants it
    if (!keepAwake || !enabled) {
      return;
    }

    // Request wake lock
    let requested = false;
    requestWakeLock().then((success) => {
      requested = success;
      if (success) {
        setupWakeLockReacquisition();
      }
    });

    // Release wake lock on unmount
    return () => {
      if (requested) {
        releaseWakeLock();
      }
    };
  }, [keepAwake, enabled]);
}

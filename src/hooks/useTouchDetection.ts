import { useState, useEffect, useRef, useCallback } from 'react';
import type { Touch } from '../types';

// Colorblind-safe color palette
const TOUCH_COLORS = [
  '#2563eb', // Blue
  '#dc2626', // Red
  '#16a34a', // Green
  '#f59e0b', // Amber
  '#a855f7', // Purple
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f43f5e', // Rose
];

interface UseTouchDetectionOptions {
  /**
   * Duration in ms after first touch to lock and stop accepting new touches
   * @default 4000
   */
  lockAfterMs?: number;

  /**
   * Minimum number of touches required
   * @default 2
   */
  minTouches?: number;

  /**
   * Maximum number of touches allowed
   * @default 12
   */
  maxTouches?: number;

  /**
   * Callback when touches are locked
   */
  onLock?: (touches: Touch[]) => void;

  /**
   * Auto-reset after completion
   * @default false
   */
  autoReset?: boolean;

  /**
   * Color offset for multi-round scenarios
   * @default 0
   */
  colorOffset?: number;
}

export function useTouchDetection(options: UseTouchDetectionOptions = {}) {
  const {
    lockAfterMs = 4000,
    minTouches = 2,
    maxTouches = 12,
    onLock,
    autoReset = false,
    colorOffset = 0,
  } = options;

  const [touches, setTouches] = useState<Touch[]>([]);
  const [locked, setLocked] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const lockTimerRef = useRef<number>();
  const activePointersRef = useRef<Map<number, Touch>>(new Map());
  const lastTouchTimeRef = useRef<number>(0);

  // Start lock timer
  const startLockTimer = useCallback(() => {
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
    }

    lockTimerRef.current = window.setTimeout(() => {
      const currentTouches = Array.from(activePointersRef.current.values());
      if (currentTouches.length >= minTouches) {
        setLocked(true);
        onLock?.(currentTouches);
      }
    }, lockAfterMs);
  }, [lockAfterMs, minTouches, onLock]);

  // Handle touch start (native touch events for better iOS support)
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      if (locked) return;

      e.preventDefault();
      e.stopPropagation();

      // Track ALL current touches (e.touches), not just changed ones
      // This ensures we capture simultaneous multi-touch properly
      const newTouchMap = new Map<number, Touch>();

      // Process all currently active touches up to maxTouches
      const touchList = Array.from(e.touches);
      const touchesToProcess = Math.min(touchList.length, maxTouches);

      // Record touch time to detect spurious touchend events
      lastTouchTimeRef.current = Date.now();

      // Debug logging for iOS Safari
      console.log(`[TouchDetection] Total touches: ${touchList.length}, Processing: ${touchesToProcess}, Previous: ${activePointersRef.current.size}`);

      for (let i = 0; i < touchesToProcess; i++) {
        const nativeTouch = touchList[i];

        // If this touch already exists, keep its color
        const existingTouch = activePointersRef.current.get(nativeTouch.identifier);

        const touch: Touch = {
          id: nativeTouch.identifier,
          x: nativeTouch.clientX,
          y: nativeTouch.clientY,
          color: existingTouch?.color || TOUCH_COLORS[(colorOffset + i) % TOUCH_COLORS.length],
        };

        newTouchMap.set(nativeTouch.identifier, touch);
      }

      console.log(`[TouchDetection] New touch map size: ${newTouchMap.size}`);

      activePointersRef.current = newTouchMap;
      setTouches(Array.from(newTouchMap.values()));

      // Start timer on first touch
      if (newTouchMap.size > 0 && !isActive) {
        console.log('[TouchDetection] Starting lock timer');
        setIsActive(true);
        startLockTimer();
      }
    },
    [locked, maxTouches, isActive, startLockTimer]
  );

  // Handle pointer down (fallback for non-touch devices)
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      // Only handle if not a touch event (avoid duplicate handling)
      if (e.pointerType === 'touch') return;
      if (locked) return;

      e.preventDefault();

      if (activePointersRef.current.size >= maxTouches) {
        return;
      }

      const touch: Touch = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        color: TOUCH_COLORS[(colorOffset + activePointersRef.current.size) % TOUCH_COLORS.length],
      };

      activePointersRef.current.set(e.pointerId, touch);
      setTouches(Array.from(activePointersRef.current.values()));

      if (activePointersRef.current.size === 1 && !isActive) {
        setIsActive(true);
        startLockTimer();
      }
    },
    [locked, maxTouches, isActive, startLockTimer]
  );

  // Handle touch end/cancel (native touch events)
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      if (locked) return;

      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      const timeSinceLastTouch = now - lastTouchTimeRef.current;

      console.log(`[TouchDetection] Touch end - remaining touches: ${e.touches.length}, time since last touch: ${timeSinceLastTouch}ms, current touches in ref: ${activePointersRef.current.size}`);

      // Ignore spurious touchend events from Safari (happens when exceeding 5 touches)
      // If we have existing touches and get touchend with 0 remaining within 1s,
      // it's Safari's forced reset when exceeding 5 touches - ignore it
      if (e.touches.length === 0 && activePointersRef.current.size > 0 && timeSinceLastTouch < 1000) {
        console.log('[TouchDetection] Ignoring spurious touchend event (Safari 5-touch limit) - keeping existing touches');
        return; // Keep existing touches, ignore Safari's forced reset
      }

      // Update to current touches (removes the ones that ended)
      const newTouchMap = new Map<number, Touch>();

      for (let i = 0; i < e.touches.length; i++) {
        const nativeTouch = e.touches[i];
        const existingTouch = activePointersRef.current.get(nativeTouch.identifier);

        if (existingTouch) {
          newTouchMap.set(nativeTouch.identifier, {
            ...existingTouch,
            x: nativeTouch.clientX,
            y: nativeTouch.clientY,
          });
        }
      }

      console.log(`[TouchDetection] After touch end - active touches: ${newTouchMap.size}`);

      activePointersRef.current = newTouchMap;
      setTouches(Array.from(newTouchMap.values()));

      // Cancel timer if all touches released (but not spurious events)
      if (newTouchMap.size === 0 && lockTimerRef.current) {
        console.log('[TouchDetection] All touches released, canceling timer');
        clearTimeout(lockTimerRef.current);
        setIsActive(false);
      }
    },
    [locked]
  );

  // Handle pointer up/cancel (fallback for non-touch devices)
  const handlePointerUpOrCancel = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (e.pointerType === 'touch') return;
      if (locked) return;

      activePointersRef.current.delete(e.pointerId);
      setTouches(Array.from(activePointersRef.current.values()));

      if (activePointersRef.current.size === 0 && lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
        setIsActive(false);
      }
    },
    [locked]
  );

  // Reset function
  const reset = useCallback(() => {
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
    }
    activePointersRef.current.clear();
    setTouches([]);
    setLocked(false);
    setIsActive(false);
  }, []);

  // Auto-reset when locked
  useEffect(() => {
    if (locked && autoReset) {
      const timer = setTimeout(reset, 3000);
      return () => clearTimeout(timer);
    }
  }, [locked, autoReset, reset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
      }
    };
  }, []);

  return {
    touches,
    locked,
    isActive,
    handleTouchStart,
    handleTouchEnd,
    handleTouchCancel: handleTouchEnd,
    handlePointerDown,
    handlePointerUp: handlePointerUpOrCancel,
    handlePointerCancel: handlePointerUpOrCancel,
    reset,
  };
}

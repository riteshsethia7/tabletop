import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
  initialTimeMs: number;
  onComplete?: () => void;
  onTick?: (remaining: number) => void;
}

export function useTimer({ initialTimeMs, onComplete, onTick }: UseTimerOptions) {
  const [timeRemaining, setTimeRemaining] = useState(initialTimeMs);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);
  const elapsedBeforePauseRef = useRef(0);
  const animationFrameRef = useRef<number>();

  const updateTimer = useCallback(() => {
    if (!startTimeRef.current || pausedAtRef.current !== null) return;

    const now = performance.now();
    const totalElapsed = (now - startTimeRef.current) + elapsedBeforePauseRef.current;
    const remaining = Math.max(0, initialTimeMs - totalElapsed);

    setTimeRemaining(remaining);
    onTick?.(remaining);

    if (remaining <= 0) {
      setIsRunning(false);
      onComplete?.();
      return;
    }

    animationFrameRef.current = requestAnimationFrame(updateTimer);
  }, [initialTimeMs, onComplete, onTick]);

  const start = useCallback(() => {
    if (isRunning) return;

    startTimeRef.current = performance.now();
    setIsRunning(true);
    setIsPaused(false);
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  }, [isRunning, updateTimer]);

  const pause = useCallback(() => {
    if (!isRunning || isPaused) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const now = performance.now();
    if (startTimeRef.current) {
      elapsedBeforePauseRef.current += (now - startTimeRef.current);
    }

    pausedAtRef.current = now;
    setIsPaused(true);
  }, [isRunning, isPaused]);

  const resume = useCallback(() => {
    if (!isPaused) return;

    startTimeRef.current = performance.now();
    pausedAtRef.current = null;
    setIsPaused(false);
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  }, [isPaused, updateTimer]);

  const reset = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    startTimeRef.current = null;
    pausedAtRef.current = null;
    elapsedBeforePauseRef.current = 0;
    setTimeRemaining(initialTimeMs);
    setIsRunning(false);
    setIsPaused(false);
  }, [initialTimeMs]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    timeRemaining,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    reset,
  };
}

// Format milliseconds to MM:SS
export function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

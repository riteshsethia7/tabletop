import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, Undo2 } from 'lucide-react';
import { useTimerStore } from '../../stores/timerStore';
import { formatTime } from '../../hooks/useTimer';
import { haptic } from '../../utils/haptics';
import { useWakeLock } from '../../hooks/useWakeLock';
import { getRangeStyle } from '../../utils/rangeInput';
// Unique colors for each player
const PLAYER_COLORS = [
  "#2563eb", "#dc2626", "#16a34a", "#f59e0b",
  "#a855f7", "#14b8a6", "#f97316", "#ec4899",
  "#8b5cf6", "#06b6d4", "#84cc16", "#f43f5e",
];


export function Timer() {
  const {
    players,
    activePlayer,
    timers,
    isPaused,
    timerSnapshots,
    setup,
    switchToPlayer,
    togglePause,
    reset,
    updateTimer,
    undo,
    loadSavedTimer,
  } = useTimerStore();

  const [view, setView] = useState<'setup' | 'timer'>('setup');
  const [setupPlayers, setSetupPlayers] = useState(2);
  const [setupTime, setSetupTime] = useState(10);

  // Keep screen awake during timer
  useWakeLock(view === 'timer');

  useEffect(() => {
    loadSavedTimer();
  }, [loadSavedTimer]);

  useEffect(() => {
    if (players > 0) {
      setView('timer');
    }
  }, [players]);

  // Timer tick effect
  useEffect(() => {
    if (isPaused) return;

    let lastTime = performance.now();
    let animationId: number;
    let running = true;

    const tick = () => {
      if (!running) return;

      const now = performance.now();
      const delta = now - lastTime;
      lastTime = now;

      // Read current state directly from store to avoid stale closure
      const currentTimers = useTimerStore.getState().timers;
      const currentTimer = currentTimers[activePlayer];

      if (!currentTimer) return;

      const newTime = Math.max(0, currentTimer.timeRemaining - delta);
      updateTimer(activePlayer, newTime);

      if (newTime > 0 && running) {
        animationId = requestAnimationFrame(tick);
      } else if (newTime === 0) {
        haptic.timerAlert();
      }
    };

    animationId = requestAnimationFrame(tick);

    return () => {
      running = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPaused, activePlayer, updateTimer]);

  const handleSetup = async () => {
    await setup(setupPlayers, setupTime);
    setView('timer');
  };

  const handlePlayerClick = (playerId: number) => {
    if (playerId === activePlayer) return; // Can switch even when paused
    switchToPlayer(playerId);
    haptic.selection();
  };

  // Setup View
  if (view === 'setup') {
    return (
      <div className="container mx-auto px-4 py-6 pb-24">
        <h1 className="text-3xl font-bold mb-6 text-center">Multi-Clock Timer</h1>

        <div className="max-w-md mx-auto space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Players: {setupPlayers}
            </label>
            <input
              type="range"
              min="2"
              max="10"
              value={setupPlayers}
              onChange={(e) => setSetupPlayers(parseInt(e.target.value))}
              style={getRangeStyle(setupPlayers, 2, 10)}
              className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>2</span>
              <span>10</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Time Per Player: {setupTime} minutes
            </label>
            <input
              type="range"
              min="1"
              max="60"
              value={setupTime}
              onChange={(e) => setSetupTime(parseInt(e.target.value))}
              style={getRangeStyle(setupTime, 1, 60)}
              className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>1 min</span>
              <span>60 min</span>
            </div>
          </div>

          <button
            onClick={handleSetup}
            className="w-full bg-primary text-white py-4 px-6 rounded-xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all"
          >
            Start Timer
          </button>
        </div>
      </div>
    );
  }

  // Timer View
  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Multi-Clock Timer</h1>
        <button
          onClick={() => setView('setup')}
          className="p-2 hover:bg-surface rounded-lg transition-colors"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Timer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {timers.map((timer) => {
            const isActive = timer.playerId === activePlayer;
            const timeLeft = timer.timeRemaining;
            const isLow = timeLeft < 60000; // Less than 1 minute
            const isOut = timeLeft <= 0;
            const playerColor = PLAYER_COLORS[timer.playerId % PLAYER_COLORS.length];

            return (
              <motion.button
                key={timer.playerId}
                onClick={() => handlePlayerClick(timer.playerId)}
                className={`relative p-6 rounded-xl border-4 transition-all ${
                  isOut ? 'opacity-50' : ''
                }`}
                style={{
                  borderColor: isActive ? playerColor : '#e5e7eb',
                  backgroundColor: isActive ? `${playerColor}15` : '#f8fafc',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                }}
                whileTap={{ scale: isActive ? 1.05 : 0.95 }}
              >
                <div className="text-sm font-medium mb-2" style={{ color: playerColor }}>
                  Player {timer.playerId + 1}
                </div>
                <div
                  className="text-4xl font-bold font-mono"
                  style={{
                    color: isOut ? '#ef4444' : isLow ? '#f59e0b' : playerColor,
                    animation: isLow && !isOut ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
                  }}
                >
                  {formatTime(timeLeft)}
                </div>
                {isActive && !isPaused && (
                  <div className="absolute top-2 right-2">
                    <div
                      className="w-3 h-3 rounded-full animate-pulse"
                      style={{ backgroundColor: playerColor }}
                    />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={togglePause}
            className="flex-1 bg-primary text-white py-4 px-6 rounded-xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isPaused ? (
              <>
                <Play className="w-6 h-6" /> Start
              </>
            ) : (
              <>
                <Pause className="w-6 h-6" /> Pause
              </>
            )}
          </button>
          <button
            onClick={undo}
            disabled={timerSnapshots.length < 2}
            className="bg-surface border-2 border-border p-4 rounded-xl hover:bg-background active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo to last stopped time"
          >
            <Undo2 className="w-6 h-6" />
          </button>
          <button
            onClick={reset}
            className="bg-surface border-2 border-border p-4 rounded-xl hover:bg-background active:scale-95 transition-all"
            title="Reset all timers"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-text-secondary">
          <p>Tap a player's clock to switch to them</p>
        </div>
      </div>
    </div>
  );
}

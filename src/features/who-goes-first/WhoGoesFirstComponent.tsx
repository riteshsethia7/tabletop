import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { useTouchDetection } from '../../hooks/useTouchDetection';
import { useWhoGoesFirstStore } from '../../stores/whoGoesFirstStore';
import { TouchCircle } from '../../components/ui/TouchCircle';
import { isIOS } from '../../utils/platform';
import { getRangeStyle } from '../../utils/rangeInput';
import type { Touch } from '../../types';

const IOS_MAX_TOUCHES = 5;
const LOCK_TIMER_MS = 2500;

// iOS Multi-Round Component
function WhoGoesFirstIOS() {
  const { winner, reset: resetStore } = useWhoGoesFirstStore();

  const [view, setView] = useState<'setup' | 'collect'>('setup');
  const [playerCount, setPlayerCount] = useState(2);
  const [round1Touches, setRound1Touches] = useState<Touch[]>([]);
  const [currentRound, setCurrentRound] = useState(1);

  const needsMultiRound = playerCount > IOS_MAX_TOUCHES;
  const round1Count = Math.min(playerCount, IOS_MAX_TOUCHES);
  const round2Count = playerCount - round1Count;
  const totalRounds = needsMultiRound ? 2 : 1;

  // Round 1: Use the working hook
  const round1Detection = useTouchDetection({
    lockAfterMs: LOCK_TIMER_MS,
    minTouches: currentRound === 1 ? 2 : 0,
    maxTouches: round1Count,
    onLock: (touches) => {
      if (needsMultiRound) {
        // Save Round 1 touches and move to Round 2
        setRound1Touches(touches);
        setCurrentRound(2);
      } else {
        // Single round - select winner directly
        useWhoGoesFirstStore.getState().setTouches(touches);
        useWhoGoesFirstStore.getState().lock();
      }
    },
  });

  // Round 2: Use the working hook again (only active in round 2)
  const round2Detection = useTouchDetection({
    lockAfterMs: LOCK_TIMER_MS,
    minTouches: currentRound === 2 ? 1 : 0,
    maxTouches: round2Count,
    colorOffset: round1Touches.length, // Continue colors from Round 1
    onLock: (touches) => {
      // Combine Round 1 + Round 2 touches
      const allTouches = [...round1Touches, ...touches];
      useWhoGoesFirstStore.getState().setTouches(allTouches);
      useWhoGoesFirstStore.getState().lock();
    },
  });

  // Use the appropriate detection based on current round
  const activeDetection = currentRound === 1 ? round1Detection : round2Detection;

  const startCollection = () => {
    setView('collect');
    setCurrentRound(1);
    setRound1Touches([]);
    round1Detection.reset();
    round2Detection.reset();
  };

  const reset = () => {
    resetStore();
    setView('setup');
    setPlayerCount(2);
    setRound1Touches([]);
    setCurrentRound(1);
    round1Detection.reset();
    round2Detection.reset();
  };

  // Display all touches: Round 1 touches + current round touches
  const displayTouches = currentRound === 2
    ? [...round1Touches, ...activeDetection.touches]
    : activeDetection.touches;

  if (view === 'setup') {
    return (
      <div className="relative w-full h-[calc(100vh-8rem)] overflow-hidden bg-background">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-4 text-center">Who Goes First?</h1>

          <div className="max-w-md mx-auto space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3 text-center">
                Number of Players
              </label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => setPlayerCount(5)}
                  className={`py-6 px-4 rounded-xl font-bold text-lg transition-all ${
                    playerCount <= 5
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-surface border-2 border-border hover:border-primary'
                  }`}
                >
                  Up to 5 Players
                </button>
                <button
                  onClick={() => setPlayerCount(6)}
                  className={`py-6 px-4 rounded-xl font-bold text-lg transition-all ${
                    playerCount > 5
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-surface border-2 border-border hover:border-primary'
                  }`}
                >
                  More than 5 Players
                </button>
              </div>

              {/* Show specific number selection */}
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: playerCount <= 5 ? 4 : 5 }, (_, i) => {
                  const num = playerCount <= 5 ? i + 2 : i + 6;
                  return (
                    <button
                      key={num}
                      onClick={() => setPlayerCount(num)}
                      className={`py-3 rounded-lg font-bold transition-all ${
                        playerCount === num
                          ? 'bg-primary text-white shadow-lg scale-105'
                          : 'bg-surface border border-border hover:border-primary'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>

            {playerCount > IOS_MAX_TOUCHES && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-surface border-2 border-primary rounded-xl p-4"
              >
                <p className="text-sm text-center mb-2">
                  <span className="font-bold text-primary">iOS Smart Mode 📱</span>
                </p>
                <p className="text-xs text-text-secondary text-center">
                  iOS allows max 5 fingers at once. We'll collect in 2 rounds:
                </p>
                <div className="mt-3 space-y-1 text-xs">
                  <p className="text-center">
                    <span className="font-medium">Round 1:</span> First {round1Count} players
                  </p>
                  <p className="text-center">
                    <span className="font-medium">Round 2:</span> Remaining {round2Count} players
                  </p>
                </div>
              </motion.div>
            )}

            <button
              onClick={startCollection}
              className="w-full bg-primary text-white py-4 px-6 rounded-xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-8rem)] overflow-hidden bg-background">
      <div className="absolute top-0 left-0 right-0 p-6 text-center z-30 pointer-events-none">
        <AnimatePresence mode="wait">
          {!activeDetection.isActive && winner === null && currentRound === 1 && (
            <motion.div
              key="instructions-r1"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h1 className="text-3xl font-bold mb-2">
                {needsMultiRound ? `Round 1 of ${totalRounds}` : 'Who Goes First?'}
              </h1>
              <p className="text-text-secondary">
                {needsMultiRound ? `First ${round1Count} players place fingers` : 'Everyone place a finger on the screen'}
              </p>
            </motion.div>
          )}

          {!activeDetection.isActive && winner === null && currentRound === 2 && (
            <motion.div
              key="instructions-r2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h1 className="text-3xl font-bold mb-2">Round 2 of {totalRounds}</h1>
              <p className="text-text-secondary">
                Remaining {round2Count} players place fingers
              </p>
            </motion.div>
          )}

          {activeDetection.isActive && !activeDetection.locked && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-2xl font-bold text-primary">
                {displayTouches.length} {displayTouches.length === 1 ? 'Player' : 'Players'}
              </h2>
              <p className="text-text-secondary">Keep fingers on screen...</p>
            </motion.div>
          )}

          {activeDetection.locked && winner === null && (
            <motion.div
              key="selecting"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-primary animate-pulse">
                Selecting...
              </h2>
            </motion.div>
          )}

          {winner !== null && (
            <motion.div
              key="winner"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-9xl"
            >
              🎉
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        onTouchStart={activeDetection.handleTouchStart}
        onTouchEnd={activeDetection.handleTouchEnd}
        onTouchCancel={activeDetection.handleTouchCancel}
        onPointerDown={activeDetection.handlePointerDown}
        onPointerUp={activeDetection.handlePointerUp}
        onPointerCancel={activeDetection.handlePointerCancel}
        className="absolute inset-0"
        style={{
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
      >
        {displayTouches.map((touch, index) => (
          <TouchCircle
            key={touch.id}
            touch={touch}
            isLocked={activeDetection.locked}
            isWinner={winner === index}
            hasWinner={winner !== null}
          />
        ))}

        {!activeDetection.isActive && !activeDetection.locked && winner === null && displayTouches.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className="text-9xl"
            >
              👆
            </motion.div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {winner !== null && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-auto px-6"
          >
            <button
              onClick={reset}
              className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 min-h-touch"
            >
              <RotateCcw className="w-6 h-6" />
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Standard Component (Non-iOS)
function WhoGoesFirstStandard() {
  const { winner, locked, reset: resetStore } = useWhoGoesFirstStore();

  const {
    touches,
    locked: touchLocked,
    isActive,
    handleTouchStart,
    handleTouchEnd,
    handleTouchCancel,
    handlePointerDown,
    handlePointerUp,
    handlePointerCancel,
    reset: resetTouch,
  } = useTouchDetection({
    minTouches: 2,
    maxTouches: 10,
    onLock: (finalTouches) => {
      useWhoGoesFirstStore.getState().setTouches(finalTouches);
      useWhoGoesFirstStore.getState().lock();
    },
  });

  const reset = () => {
    resetStore();
    resetTouch();
  };

  return (
    <div className="relative w-full h-[calc(100vh-8rem)] overflow-hidden bg-background">
      <div className="absolute top-0 left-0 right-0 p-6 text-center z-30 pointer-events-none">
        <AnimatePresence mode="wait">
          {!isActive && !locked && (
            <motion.div
              key="instructions"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h1 className="text-3xl font-bold mb-2">Who Goes First?</h1>
              <p className="text-text-secondary">
                Everyone place a finger on the screen
              </p>
              <p className="text-text-secondary text-sm">
                (2-10 players)
              </p>
            </motion.div>
          )}

          {isActive && !touchLocked && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-2xl font-bold text-primary">
                {touches.length} {touches.length === 1 ? 'Player' : 'Players'}
              </h2>
              <p className="text-text-secondary">Keep fingers on screen...</p>
            </motion.div>
          )}

          {touchLocked && winner === null && (
            <motion.div
              key="selecting"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-primary animate-pulse">
                Selecting...
              </h2>
            </motion.div>
          )}

          {winner !== null && (
            <motion.div
              key="winner"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-9xl"
            >
              🎉
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className="absolute inset-0"
        style={{
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
      >
        {touches.map((touch, index) => (
          <TouchCircle
            key={touch.id}
            touch={touch}
            isLocked={touchLocked}
            isWinner={winner === index}
            hasWinner={winner !== null}
          />
        ))}

        {!isActive && !locked && touches.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className="text-9xl"
            >
              👆
            </motion.div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {winner !== null && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-auto px-6"
          >
            <button
              onClick={reset}
              className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 min-h-touch"
            >
              <RotateCcw className="w-6 h-6" />
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main Export - conditionally renders iOS or Standard version
export function WhoGoesFirst() {
  const deviceIsIOS = isIOS();

  if (deviceIsIOS) {
    return <WhoGoesFirstIOS />;
  }

  return <WhoGoesFirstStandard />;
}

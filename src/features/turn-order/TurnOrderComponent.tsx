import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { useTurnOrderStore } from '../../stores/turnOrderStore';
import { useTouchDetection } from '../../hooks/useTouchDetection';
import { TouchCircle } from '../../components/ui/TouchCircle';
import { isIOS } from '../../utils/platform';
import type { Touch } from '../../types';

const IOS_MAX_TOUCHES = 5;
const LOCK_TIMER_MS = 2500;

export function TurnOrder() {
  const { order, reset: resetStore } = useTurnOrderStore();
  const deviceIsIOS = isIOS();

  // iOS multi-round state — Android skips setup and goes straight to collect
  const [view, setView] = useState<'setup' | 'collect'>(deviceIsIOS ? 'setup' : 'collect');
  const [playerCount, setPlayerCount] = useState(deviceIsIOS ? 2 : 10);
  const [round1Touches, setRound1Touches] = useState<Touch[]>([]);
  const [currentRound, setCurrentRound] = useState(1);

  const needsMultiRound = deviceIsIOS && playerCount > IOS_MAX_TOUCHES;
  const round1Count = deviceIsIOS ? Math.min(playerCount, IOS_MAX_TOUCHES) : playerCount;
  const round2Count = playerCount - round1Count;
  const totalRounds = needsMultiRound ? 2 : 1;
  const hasOrder = order.length > 0;

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
        // Single round - generate order directly
        useTurnOrderStore.getState().setTouches(touches);
        useTurnOrderStore.getState().generateOrder();
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
      useTurnOrderStore.getState().setTouches(allTouches);
      useTurnOrderStore.getState().generateOrder();
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
    if (deviceIsIOS) {
      setView('setup');
      setPlayerCount(2);
    } else {
      // Android: stay in collect view, just reset detection
      setView('collect');
      setPlayerCount(10);
    }
    setRound1Touches([]);
    setCurrentRound(1);
    round1Detection.reset();
    round2Detection.reset();
  };

  // Get all touches to display
  const displayTouches = currentRound === 2
    ? [...round1Touches, ...activeDetection.touches]
    : activeDetection.touches;

  // Setup View
  if (view === 'setup') {
    return (
      <div className="relative w-full min-h-[calc(100vh-8rem)] overflow-hidden bg-background pb-24">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-4 text-center">Turn Order Generator</h1>

          <div className="max-w-md mx-auto space-y-4">
            <p className="text-center text-text-secondary mb-6">
              Choose your group size
            </p>

            {deviceIsIOS ? (
              <>
                <button
                  onClick={() => {
                    setPlayerCount(5);
                    startCollection();
                  }}
                  className="w-full py-8 px-6 rounded-xl font-bold text-xl bg-primary text-white shadow-lg hover:opacity-90 active:scale-95 transition-all"
                >
                  Up to 5 Players
                </button>

                <button
                  onClick={() => {
                    setPlayerCount(10);
                    startCollection();
                  }}
                  className="w-full py-8 px-6 rounded-xl font-bold text-xl bg-primary text-white shadow-lg hover:opacity-90 active:scale-95 transition-all"
                >
                  <div>More than 5 Players</div>
                  <div className="text-xs font-normal mt-1 opacity-90">iOS will collect in 2 rounds</div>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setPlayerCount(10);
                  startCollection();
                }}
                className="w-full py-8 px-6 rounded-xl font-bold text-xl bg-primary text-white shadow-lg hover:opacity-90 active:scale-95 transition-all"
              >
                Start
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Collection View
  return (
    <div className="relative w-full h-[calc(100vh-8rem)] overflow-hidden bg-background">
      {/* Instructions */}
      <div className="absolute top-6 left-0 right-0 text-center z-30 pointer-events-none">
        <AnimatePresence mode="wait">
          {!activeDetection.isActive && !hasOrder && currentRound === 1 && (
            <motion.div
              key="instructions-r1"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h1 className="text-3xl font-bold mb-2">
                {needsMultiRound ? `Round 1 of ${totalRounds}` : 'Turn Order Generator'}
              </h1>
              <p className="text-text-secondary">
                {needsMultiRound ? `First ${round1Count} players place fingers` : 'Everyone place a finger on the screen'}
              </p>
            </motion.div>
          )}

          {!activeDetection.isActive && !hasOrder && currentRound === 2 && (
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

          {activeDetection.isActive && !activeDetection.locked && !hasOrder && (
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

          {!hasOrder && activeDetection.locked && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-primary animate-pulse">
                Generating Order...
              </h2>
            </motion.div>
          )}

          {hasOrder && (
            <motion.div
              key="generated"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-primary">
                Order Generated
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Touch Area */}
      <div
        onTouchStart={hasOrder ? undefined : activeDetection.handleTouchStart}
        onTouchEnd={hasOrder ? undefined : activeDetection.handleTouchEnd}
        onTouchCancel={hasOrder ? undefined : activeDetection.handleTouchCancel}
        onPointerDown={hasOrder ? undefined : activeDetection.handlePointerDown}
        onPointerUp={hasOrder ? undefined : activeDetection.handlePointerUp}
        onPointerCancel={hasOrder ? undefined : activeDetection.handlePointerCancel}
        className="absolute inset-0"
        style={{
          touchAction: hasOrder ? 'auto' : 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
      >
        {/* Touch Circles */}
        {displayTouches.map((touch, index) => {
          const positionInOrder = hasOrder ? order.indexOf(index) : undefined;
          return (
            <TouchCircle
              key={touch.id}
              touch={touch}
              isLocked={activeDetection.locked || hasOrder}
              isWinner={false}
              position={positionInOrder}
            />
          );
        })}
      </div>

      {/* Reset Button */}
      <AnimatePresence>
        {hasOrder && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-20 left-0 right-0 flex justify-center px-6 z-40"
          >
            <button
              onClick={reset}
              className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 min-h-touch"
            >
              <RotateCcw className="w-6 h-6" />
              Generate New Order
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

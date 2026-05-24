import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { useTeamBuilderStore } from '../../stores/teamBuilderStore';
import { useTouchDetection } from '../../hooks/useTouchDetection';
import { TouchCircle } from '../../components/ui/TouchCircle';
import { isIOS } from '../../utils/platform';
import { getRangeStyle } from '../../utils/rangeInput';
import type { Touch } from '../../types';

const IOS_MAX_TOUCHES = 5;
const LOCK_TIMER_MS = 2500;

export function TeamBuilder() {
  const { teams, setNumTeams, reset: resetStore } = useTeamBuilderStore();
  const deviceIsIOS = isIOS();

  // State
  const [view, setView] = useState<'setup' | 'collect'>('setup');
  const [numTeamsSelected, setNumTeamsSelected] = useState(2);
  const [playerCount, setPlayerCount] = useState(2);
  const [round1Touches, setRound1Touches] = useState<Touch[]>([]);
  const [currentRound, setCurrentRound] = useState(1);

  const needsMultiRound = deviceIsIOS && playerCount > IOS_MAX_TOUCHES;
  const round1Count = Math.min(playerCount, IOS_MAX_TOUCHES);
  const round2Count = playerCount - round1Count;
  const totalRounds = needsMultiRound ? 2 : 1;
  const hasTeams = teams.length > 0;

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
        // Single round - generate teams directly
        useTeamBuilderStore.getState().setTouches(touches);
        useTeamBuilderStore.getState().generateTeams();
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
      useTeamBuilderStore.getState().setTouches(allTouches);
      useTeamBuilderStore.getState().generateTeams();
    },
  });

  // Use the appropriate detection based on current round
  const activeDetection = currentRound === 1 ? round1Detection : round2Detection;

  const startCollection = () => {
    setNumTeams(numTeamsSelected);
    setView('collect');
    setCurrentRound(1);
    setRound1Touches([]);
    round1Detection.reset();
    round2Detection.reset();
  };

  const reset = () => {
    resetStore();
    setView('setup');
    setNumTeamsSelected(2);
    setPlayerCount(2);
    setRound1Touches([]);
    setCurrentRound(1);
    round1Detection.reset();
    round2Detection.reset();
  };

  // Get all touches to display
  const displayTouches = currentRound === 2
    ? [...round1Touches, ...activeDetection.touches]
    : activeDetection.touches;

  // Setup View (iOS only)
  if (view === 'setup' && deviceIsIOS) {
    return (
      <div className="relative w-full min-h-[calc(100vh-8rem)] overflow-hidden bg-background pb-24">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-6 text-center">Team Builder</h1>

          <div className="max-w-md mx-auto space-y-6">
            {/* Number of Teams */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Number of Teams: {numTeamsSelected}
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => setNumTeamsSelected(num)}
                    className={`py-4 px-2 rounded-lg font-bold transition-all ${
                      numTeamsSelected === num
                        ? 'bg-primary text-white shadow-lg scale-105'
                        : 'bg-surface border-2 border-border hover:border-primary'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Players */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Number of Players: {playerCount}
              </label>
              <input
                type="range"
                min="2"
                max="10"
                value={playerCount}
                onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                style={getRangeStyle(playerCount, 2, 10)}
                className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-text-secondary mt-1">
                <span>2</span>
                <span>10</span>
              </div>
            </div>

            {/* iOS Multi-Round Info */}
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
              Place Fingers
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Collection View
  return (
    <div className="relative w-full min-h-[calc(100vh-8rem)] overflow-hidden bg-background pb-24">
      {/* Status Messages */}
      <div className="absolute top-6 left-0 right-0 text-center z-30 pointer-events-none">
        <AnimatePresence mode="wait">
          {!activeDetection.isActive && !hasTeams && currentRound === 1 && (
            <motion.div
              key="instruction-r1"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-2xl font-bold mb-2">
                {needsMultiRound ? `Round 1 of ${totalRounds}` : 'Place Fingers'}
              </h2>
              <p className="text-text-secondary">
                {needsMultiRound ? `First ${round1Count} players touch screen` : 'Everyone touch the screen'}
              </p>
            </motion.div>
          )}

          {!activeDetection.isActive && !hasTeams && currentRound === 2 && (
            <motion.div
              key="instruction-r2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-2xl font-bold mb-2">Round 2 of {totalRounds}</h2>
              <p className="text-text-secondary">
                Remaining {round2Count} players touch screen
              </p>
            </motion.div>
          )}

          {activeDetection.isActive && !activeDetection.locked && !hasTeams && (
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

          {!hasTeams && activeDetection.locked && (
            <motion.div
              key="creating"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-primary animate-pulse">
                Creating Teams...
              </h2>
            </motion.div>
          )}

          {hasTeams && (
            <motion.div
              key="created"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-primary">
                Teams Created!
              </h2>
              <p className="text-text-secondary mt-2">
                Numbers show team assignments
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Touch Area */}
      <div
        onTouchStart={hasTeams ? undefined : activeDetection.handleTouchStart}
        onTouchEnd={hasTeams ? undefined : activeDetection.handleTouchEnd}
        onTouchCancel={hasTeams ? undefined : activeDetection.handleTouchCancel}
        onPointerDown={hasTeams ? undefined : activeDetection.handlePointerDown}
        onPointerUp={hasTeams ? undefined : activeDetection.handlePointerUp}
        onPointerCancel={hasTeams ? undefined : activeDetection.handlePointerCancel}
        className="absolute inset-0"
        style={{
          touchAction: hasTeams ? 'auto' : 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
      >
        {/* Touch Circles with Team Numbers */}
        {displayTouches.map((touch) => {
          // Find which team this touch belongs to (0-indexed, will display as 1, 2, 3...)
          let teamIndex: number | undefined = undefined;
          if (hasTeams) {
            for (let i = 0; i < teams.length; i++) {
              if (teams[i].players.some(p => p.id === touch.id)) {
                teamIndex = i; // Will display as i+1 in TouchCircle
                break;
              }
            }
          }

          return (
            <TouchCircle
              key={touch.id}
              touch={touch}
              isLocked={activeDetection.locked || hasTeams}
              isWinner={false}
              position={teamIndex}
            />
          );
        })}
      </div>

      {/* Reset Button */}
      <AnimatePresence>
        {hasTeams && (
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
              Create New Teams
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

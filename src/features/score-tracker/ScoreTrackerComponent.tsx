import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trophy,
  X,
  Check,
  Undo,
  Delete,
} from 'lucide-react';
import { useScoreStore, calculateTotals, getWinners } from '../../stores/scoreStore';

/**
 * Evaluate a simple arithmetic expression string containing +, -, and numbers.
 * e.g. "4-3+7" => 8, "-5" => -5, "10" => 10
 * Returns 0 for empty or invalid input.
 */
function evaluateScoreExpression(expr: string): number {
  const trimmed = expr.trim();
  if (!trimmed) return 0;

  // Remove all spaces
  const cleaned = trimmed.replace(/\s/g, '');

  // Validate: only digits, +, -, and decimal points allowed
  if (!/^[0-9+\-.*\/()]+$/.test(cleaned)) return 0;

  // Split by + and - while keeping the operators
  // This regex splits "4-3+7" into ["4", "-3", "+7"]
  // and "-5+3" into ["-5", "+3"]
  const tokens = cleaned.match(/[+-]?[0-9]*\.?[0-9]+/g);
  if (!tokens) return 0;

  let result = 0;
  for (const token of tokens) {
    const num = parseFloat(token);
    if (isNaN(num)) return 0;
    result += num;
  }

  return Math.round(result * 100) / 100; // Avoid floating point issues
}

/**
 * Check if an expression string contains operators (is multi-part)
 */
function isExpressionMultiPart(expr: string): boolean {
  const trimmed = expr.trim();
  if (!trimmed) return false;
  // Has + anywhere, or has - after the first character (not just a leading negative)
  return trimmed.includes('+') || trimmed.slice(1).includes('-');
}


// ─── Custom Score Keypad Component ───────────────────────────────────────────

interface ScoreKeypadProps {
  playerName: string;
  value: string;
  onChange: (value: string) => void;
  onDone: () => void;
}

function ScoreKeypad({ playerName, value, onChange, onDone }: ScoreKeypadProps) {
  const evaluated = evaluateScoreExpression(value);
  const hasExpression = isExpressionMultiPart(value);

  const append = (char: string) => {
    if (value === '0' && char !== '+' && char !== '-' && char !== '.') {
      onChange(char);
    } else {
      onChange(value + char);
    }
  };

  const handleKey = (key: string) => {
    switch (key) {
      case 'backspace':
        if (value.length <= 1) {
          onChange('0');
        } else {
          onChange(value.slice(0, -1));
        }
        break;
      case 'clear':
        onChange('0');
        break;
      case '+':
      case '-': {
        // Don't add operator if last char is already an operator
        const lastChar = value[value.length - 1];
        if (lastChar === '+' || lastChar === '-') {
          // Replace the last operator
          onChange(value.slice(0, -1) + key);
        } else {
          append(key);
        }
        break;
      }
      case '.': {
        // Find the last number segment (after last + or -)
        const segments = value.split(/[+-]/);
        const lastSegment = segments[segments.length - 1];
        if (!lastSegment.includes('.')) {
          append('.');
        }
        break;
      }
      default:
        // Digit
        append(key);
        break;
    }
  };

  const keypadButtons = [
    ['1', '2', '3', '+'],
    ['4', '5', '6', '-'],
    ['7', '8', '9', '.'],
    ['clear', '0', 'backspace', 'done'],
  ];

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t-2 border-border shadow-2xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Display area */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-sm text-text-secondary mb-1">{playerName}</p>
        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-bold font-mono tracking-wide break-all min-h-[2.5rem]">
            {value || '0'}
          </div>
          {hasExpression && (
            <div className="text-lg text-primary font-bold ml-3 whitespace-nowrap">
              = {evaluated}
            </div>
          )}
        </div>
      </div>

      {/* Keypad grid */}
      <div className="px-2 pb-2">
        {keypadButtons.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-1.5 mb-1.5">
            {row.map((key) => {
              const isOperator = key === '+' || key === '-';
              const isDone = key === 'done';
              const isClear = key === 'clear';
              const isBackspace = key === 'backspace';

              let label: React.ReactNode = key;
              let className = 'py-3.5 rounded-xl font-bold text-lg transition-all active:scale-95 ';

              if (isDone) {
                label = <Check className="w-6 h-6 mx-auto" />;
                className += 'bg-primary text-white';
              } else if (isClear) {
                label = 'C';
                className += 'bg-red-500/15 text-red-500 text-base';
              } else if (isBackspace) {
                label = <Delete className="w-5 h-5 mx-auto" />;
                className += 'bg-background text-text-secondary';
              } else if (isOperator) {
                className += 'bg-primary/15 text-primary text-2xl';
              } else if (key === '.') {
                className += 'bg-background text-text text-2xl';
              } else {
                // Digit
                className += 'bg-background text-text';
              }

              return (
                <button
                  key={key}
                  onClick={() => {
                    if (isDone) {
                      onDone();
                    } else {
                      handleKey(key);
                    }
                  }}
                  className={className}
                >
                  {label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </motion.div>
  );
}


// ─── Main Component ──────────────────────────────────────────────────────────

export function ScoreTracker() {
  const {
    currentGame,
    createGame,
    addRound,
    undoRound,
    clearCurrentGame,
  } = useScoreStore();

  const [view, setView] = useState<'setup' | 'game' | 'leaderboard'>('setup');
  const [finalGameData, setFinalGameData] = useState<typeof currentGame | null>(null);
  const [gameName, setGameName] = useState('');
  const [playerNames, setPlayerNames] = useState(['', '']);
  const [roundScores, setRoundScores] = useState<Record<string, string>>({});
  const [lowestScoreWins, setLowestScoreWins] = useState(false);
  const [activeKeypadPlayerId, setActiveKeypadPlayerId] = useState<string | null>(null);

  // Ref to scroll the active player into view
  const playerRowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (currentGame) {
      setView('game');
      // Initialize round scores
      const scores: Record<string, string> = {};
      currentGame.players.forEach((player) => {
        scores[player.id] = '0';
      });
      setRoundScores(scores);
    }
  }, [currentGame]);

  const handleCreateGame = async () => {
    const validNames = playerNames.filter((name) => name.trim() !== '');
    if (gameName.trim() && validNames.length >= 2) {
      await createGame(gameName, validNames, lowestScoreWins);
      setGameName('');
      setPlayerNames(['', '']);
      setLowestScoreWins(false);
    }
  };

  const handleAddRound = async () => {
    if (!currentGame) return;

    const scores = currentGame.players.map((player) => ({
      playerId: player.id,
      score: evaluateScoreExpression(roundScores[player.id] || '0'),
    }));

    await addRound(scores);

    // Reset scores to 0
    const resetScores: Record<string, string> = {};
    currentGame.players.forEach((player) => {
      resetScores[player.id] = '0';
    });
    setRoundScores(resetScores);
  };

  const openKeypad = (playerId: string) => {
    setActiveKeypadPlayerId(playerId);
    // Clear the "0" when opening keypad for fresh entry
    if (roundScores[playerId] === '0') {
      setRoundScores({ ...roundScores, [playerId]: '' });
    }
    // Scroll into view
    setTimeout(() => {
      playerRowRefs.current[playerId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const closeKeypad = () => {
    if (activeKeypadPlayerId) {
      // If empty, reset to 0
      const val = roundScores[activeKeypadPlayerId];
      if (!val || val.trim() === '' || val === '-' || val === '+') {
        setRoundScores({ ...roundScores, [activeKeypadPlayerId]: '0' });
      }
    }
    setActiveKeypadPlayerId(null);
  };

  const totals = currentGame ? calculateTotals(currentGame) : [];
  const winners = currentGame ? getWinners(currentGame) : [];
  const hasRounds = currentGame && currentGame.rounds.length > 0;
  const isLowest = currentGame?.lowestScoreWins ?? false;

  // Sort: ascending for lowest-wins, descending for highest-wins
  const sortedTotals = [...totals].sort((a, b) =>
    isLowest ? a.total - b.total : b.total - a.total
  );

  const activePlayer = currentGame?.players.find((p) => p.id === activeKeypadPlayerId);

  // Setup View
  if (view === 'setup') {
    return (
      <div className="container mx-auto px-4 py-6 pb-24">
        <h1 className="text-3xl font-bold mb-6">New Game</h1>

        <div className="max-w-md mx-auto space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Game Name</label>
            <input
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="e.g., Friday Game Night"
              className="w-full p-3 bg-surface border-2 border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          {/* Lowest Score Wins Toggle */}
          <div
            className="flex items-center justify-between p-4 bg-surface border-2 border-border rounded-xl cursor-pointer select-none active:scale-[0.98] transition-all"
            onClick={() => setLowestScoreWins(!lowestScoreWins)}
          >
            <div>
              <p className="font-medium">Lowest Score Wins</p>
              <p className="text-sm text-text-secondary">
                {lowestScoreWins ? 'Player with the lowest total wins' : 'Player with the highest total wins'}
              </p>
            </div>
            <div
              className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                lowestScoreWins ? 'bg-primary' : 'bg-border'
              }`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200 ${
                  lowestScoreWins ? 'translate-x-[22px]' : 'translate-x-0.5'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Players</label>
            <div className="space-y-2">
              {playerNames.map((name, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      const newNames = [...playerNames];
                      newNames[index] = e.target.value;
                      setPlayerNames(newNames);
                    }}
                    placeholder={`Player ${index + 1}`}
                    className="flex-1 p-3 bg-surface border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                  {playerNames.length > 2 && (
                    <button
                      onClick={() => setPlayerNames(playerNames.filter((_, i) => i !== index))}
                      className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 active:scale-95 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {playerNames.length < 12 && (
              <button
                onClick={() => setPlayerNames([...playerNames, ''])}
                className="mt-3 w-full p-3 bg-surface border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Player
              </button>
            )}
          </div>

          <button
            onClick={handleCreateGame}
            disabled={!gameName.trim() || playerNames.filter((n) => n.trim()).length < 2}
            className="w-full p-3 bg-primary text-white rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  // Game View
  if (view === 'game' && currentGame) {
    return (
      <div className={`container mx-auto px-4 py-6 ${activeKeypadPlayerId ? 'pb-80' : 'pb-24'}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{currentGame.name}</h1>
            <p className="text-text-secondary text-sm">
              Round {currentGame.rounds.length + 1}
              {isLowest && (
                <span className="ml-2 text-primary font-medium">• Lowest wins</span>
              )}
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Round Entry */}
          <div className="bg-surface border-2 border-border rounded-xl p-6">
            <h2 className="text-lg font-bold mb-2">Enter Scores</h2>
            <p className="text-xs text-text-secondary mb-4">
              Tap a score to edit • supports expressions like 4-3+7
            </p>
            <div className="space-y-2">
              {currentGame.players.map((player) => {
                const rawValue = roundScores[player.id] || '0';
                const evaluated = evaluateScoreExpression(rawValue);
                const hasExpr = isExpressionMultiPart(rawValue);
                const isActive = activeKeypadPlayerId === player.id;

                return (
                  <div
                    key={player.id}
                    ref={(el) => { playerRowRefs.current[player.id] = el; }}
                    onClick={() => openKeypad(player.id)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      isActive
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-background border-2 border-transparent hover:border-border'
                    }`}
                  >
                    <span className="font-medium">{player.name}</span>
                    <div className="flex items-center gap-2">
                      {hasExpr && (
                        <span className="text-xs text-text-secondary">
                          {rawValue} =
                        </span>
                      )}
                      <span className={`text-xl font-bold min-w-[2rem] text-right ${
                        isActive ? 'text-primary' : ''
                      }`}>
                        {hasExpr ? evaluated : (rawValue || '0')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 mt-6">
              {hasRounds && (
                <button
                  onClick={undoRound}
                  className="flex-1 p-3 bg-background border-2 border-border rounded-lg hover:bg-surface active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Undo className="w-5 h-5" />
                  Undo Last
                </button>
              )}
              <button
                onClick={() => {
                  closeKeypad();
                  handleAddRound();
                }}
                className="flex-1 p-3 bg-primary text-white rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Add Round
              </button>
            </div>
          </div>

          {/* Scoreboard */}
          {hasRounds && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface border-2 border-border rounded-xl p-6"
            >
              <h2 className="text-lg font-bold mb-4">Scoreboard</h2>
              <div className="space-y-2">
                {sortedTotals
                  .map(({ playerId, total }, index) => {
                    const player = currentGame.players.find((p) => p.id === playerId);
                    const isWinner = winners.some((w) => w.id === playerId);
                    return (
                      <div
                        key={playerId}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          isWinner ? 'bg-primary/10 border-2 border-primary' : 'bg-background'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {index === 0 && <Trophy className="w-5 h-5 text-primary" />}
                          <span className="font-medium">{player?.name}</span>
                        </div>
                        <span className="text-2xl font-bold text-primary">{total}</span>
                      </div>
                    );
                  })}
              </div>

              {winners.length > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-6 p-4 bg-primary text-white rounded-lg text-center"
                >
                  <p className="text-sm mb-1">Current Leader{winners.length > 1 ? 's' : ''}</p>
                  <p className="text-xl font-bold">
                    {winners.map((w) => w.name).join(', ')} 🏆
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* End Game Button */}
          {hasRounds && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center pt-4"
            >
              <button
                onClick={() => {
                  closeKeypad();
                  setFinalGameData(currentGame);
                  setView('leaderboard');
                }}
                className="bg-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-red-600 active:scale-95 transition-all"
              >
                End Game
              </button>
            </motion.div>
          )}
        </div>

        {/* Custom Keypad Overlay */}
        <AnimatePresence>
          {activeKeypadPlayerId && activePlayer && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40"
                onClick={closeKeypad}
              />
              <ScoreKeypad
                playerName={activePlayer.name}
                value={roundScores[activeKeypadPlayerId] || '0'}
                onChange={(val) =>
                  setRoundScores({ ...roundScores, [activeKeypadPlayerId]: val })
                }
                onDone={closeKeypad}
              />
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Leaderboard View
  if (view === 'leaderboard' && finalGameData) {
    const finalTotals = calculateTotals(finalGameData);
    const finalWinners = getWinners(finalGameData);
    const finalIsLowest = finalGameData.lowestScoreWins ?? false;
    const finalSorted = [...finalTotals].sort((a, b) =>
      finalIsLowest ? a.total - b.total : b.total - a.total
    );

    return (
      <div className="container mx-auto px-4 py-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-8xl mb-4"
            >
              🏆
            </motion.div>
            <h1 className="text-4xl font-bold mb-2">Game Over!</h1>
            <p className="text-text-secondary">{finalGameData.name}</p>
            {finalIsLowest && (
              <p className="text-sm text-primary font-medium mt-1">Lowest score wins</p>
            )}
          </div>

          {/* Final Standings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface border-2 border-border rounded-xl p-6 mb-6"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Final Standings</h2>
            <div className="space-y-3">
              {finalSorted
                .map(({ playerId, total }, index) => {
                  const player = finalGameData.players.find((p) => p.id === playerId);
                  const isWinner = finalWinners.some((w) => w.id === playerId);
                  return (
                    <motion.div
                      key={playerId}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-xl ${
                        isWinner
                          ? 'bg-primary text-white shadow-lg scale-105'
                          : 'bg-background'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                            isWinner ? 'bg-white/20' : 'bg-surface'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            {index === 0 && <Trophy className="w-6 h-6" />}
                            <span className="font-bold text-xl">{player?.name}</span>
                          </div>
                          <p className={`text-sm ${isWinner ? 'text-white/80' : 'text-text-secondary'}`}>
                            {finalGameData.rounds.length} rounds played
                          </p>
                        </div>
                      </div>
                      <div className="text-4xl font-bold">{total}</div>
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>

          {/* New Game Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + finalTotals.length * 0.1 }}
            className="flex justify-center"
          >
            <button
              onClick={() => {
                clearCurrentGame();
                setFinalGameData(null);
                setView('setup');
                setGameName('');
                setPlayerNames(['', '']);
              }}
              className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:opacity-90 active:scale-95 transition-all"
            >
              New Game
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Default: shouldn't reach here, but fallback to setup
  return null;
}

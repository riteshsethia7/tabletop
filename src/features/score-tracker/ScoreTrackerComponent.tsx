import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Trophy,
  X,
  Check,
  Undo,
} from 'lucide-react';
import { useScoreStore, calculateTotals, getWinners } from '../../stores/scoreStore';

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
      await createGame(gameName, validNames);
      setGameName('');
      setPlayerNames(['', '']);
    }
  };

  const handleAddRound = async () => {
    if (!currentGame) return;

    const scores = currentGame.players.map((player) => ({
      playerId: player.id,
      score: parseInt(roundScores[player.id] || '0', 10) || 0,
    }));

    await addRound(scores);

    // Reset scores to 0
    const resetScores: Record<string, string> = {};
    currentGame.players.forEach((player) => {
      resetScores[player.id] = '0';
    });
    setRoundScores(resetScores);
  };

  const totals = currentGame ? calculateTotals(currentGame) : [];
  const winners = currentGame ? getWinners(currentGame) : [];
  const hasRounds = currentGame && currentGame.rounds.length > 0;

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
      <div className="container mx-auto px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{currentGame.name}</h1>
            <p className="text-text-secondary text-sm">
              Round {currentGame.rounds.length + 1}
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Round Entry */}
          <div className="bg-surface border-2 border-border rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">Enter Scores</h2>
            <div className="space-y-3">
              {currentGame.players.map((player) => (
                <div key={player.id} className="flex items-center gap-3">
                  <span className="flex-1 font-medium">{player.name}</span>
                  <input
                    type="number"
                    value={roundScores[player.id] || '0'}
                    onChange={(e) =>
                      setRoundScores({ ...roundScores, [player.id]: e.target.value })
                    }
                    className="w-24 p-2 bg-background border-2 border-border rounded-lg text-center font-bold focus:outline-none focus:border-primary"
                  />
                </div>
              ))}
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
                onClick={handleAddRound}
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
                {totals
                  .sort((a, b) => b.total - a.total)
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
      </div>
    );
  }

  // Leaderboard View
  if (view === 'leaderboard' && finalGameData) {
    const finalTotals = calculateTotals(finalGameData);
    const finalWinners = getWinners(finalGameData);

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
              {finalTotals
                .sort((a, b) => b.total - a.total)
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

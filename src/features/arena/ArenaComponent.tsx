import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Trash2,
  Trophy,
  Users,
  X,
  Gamepad2,
  Medal,
  Award,
} from 'lucide-react';
import { useArenaStore, getChampions } from '../../stores/arenaStore';
import { useWakeLock } from '../../hooks/useWakeLock';

export function Arena() {
  const {
    currentArena,
    arenas,
    createArena,
    loadArena,
    addGame,
    deleteGame,
    deleteArena,
    loadAllArenas,
    clearCurrentArena,
  } = useArenaStore();

  const [view, setView] = useState<'list' | 'setup' | 'arena'>('list');
  const [arenaName, setArenaName] = useState('');
  const [playerNames, setPlayerNames] = useState(['', '']);
  const [gameName, setGameName] = useState('');
  const [winnerId, setWinnerId] = useState('');

  // Keep screen awake during arena
  useWakeLock(view === 'arena');

  useEffect(() => {
    loadAllArenas();
  }, [loadAllArenas]);

  useEffect(() => {
    if (currentArena) {
      setView('arena');
    }
  }, [currentArena]);

  const handleCreateArena = async () => {
    const validNames = playerNames.filter((name) => name.trim() !== '');
    if (arenaName.trim() && validNames.length >= 2) {
      await createArena(arenaName, validNames);
      setArenaName('');
      setPlayerNames(['', '']);
    }
  };

  const handleAddGame = async () => {
    if (!currentArena || !gameName.trim() || !winnerId) return;

    await addGame(gameName, winnerId);
    setGameName('');
    setWinnerId('');
  };

  const champions = currentArena ? getChampions(currentArena) : [];
  const hasGames = currentArena && currentArena.games.length > 0;

  // Setup View
  if (view === 'setup') {
    return (
      <div className="container mx-auto px-4 py-6 pb-24">
        <h1 className="text-3xl font-bold mb-6">New Arena</h1>

        <div className="max-w-md mx-auto space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Arena Name</label>
            <input
              type="text"
              value={arenaName}
              onChange={(e) => setArenaName(e.target.value)}
              placeholder="e.g., Championship Tournament"
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

          <div className="flex gap-3">
            <button
              onClick={() => setView('list')}
              className="flex-1 p-3 bg-surface border-2 border-border rounded-lg hover:bg-background active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateArena}
              disabled={!arenaName.trim() || playerNames.filter((n) => n.trim()).length < 2}
              className="flex-1 p-3 bg-primary text-white rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Arena
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Arena View
  if (view === 'arena' && currentArena) {
    // Sort players by wins (descending)
    const sortedPlayers = [...currentArena.players].sort((a, b) => b.wins - a.wins);

    return (
      <div className="container mx-auto px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{currentArena.name}</h1>
            <p className="text-text-secondary text-sm">
              {currentArena.games.length} {currentArena.games.length === 1 ? 'game' : 'games'} played
            </p>
          </div>
          <button
            onClick={() => {
              clearCurrentArena();
              setView('list');
            }}
            className="p-2 hover:bg-surface rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Add Game */}
          <div className="bg-surface border-2 border-border rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5" />
              Record Game Result
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="Game name (e.g., Catan, Ticket to Ride)"
                className="w-full p-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary"
              />
              <div>
                <label className="block text-sm font-medium mb-2">Winner</label>
                <select
                  value={winnerId}
                  onChange={(e) => setWinnerId(e.target.value)}
                  className="w-full p-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="">Select winner...</option>
                  {currentArena.players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAddGame}
                disabled={!gameName.trim() || !winnerId}
                className="w-full p-3 bg-primary text-white rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Game
              </button>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-surface border-2 border-border rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Leaderboard
            </h2>
            <div className="space-y-2">
              {sortedPlayers.map((player, index) => {
                const isChampion = champions.some((c) => c.id === player.id);
                const Icon = index === 0 ? Trophy : index === 1 ? Medal : index === 2 ? Award : null;

                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      isChampion && hasGames
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-background'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-text-secondary w-8">
                        {index + 1}
                      </span>
                      {Icon && <Icon className="w-5 h-5 text-primary" />}
                      <div>
                        <p className="font-bold">{player.name}</p>
                        <p className="text-sm text-text-secondary">
                          {player.gamesPlayed} {player.gamesPlayed === 1 ? 'game' : 'games'} played
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary">{player.wins}</p>
                      <p className="text-xs text-text-secondary">
                        {player.gamesPlayed > 0
                          ? Math.round((player.wins / player.gamesPlayed) * 100)
                          : 0}
                        % win rate
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {champions.length > 0 && hasGames && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-6 p-4 bg-primary text-white rounded-lg text-center"
              >
                <p className="text-sm mb-1">Current Champion{champions.length > 1 ? 's' : ''}</p>
                <p className="text-xl font-bold">
                  {champions.map((c) => c.name).join(', ')} 🏆
                </p>
              </motion.div>
            )}
          </div>

          {/* Game History */}
          {currentArena.games.length > 0 && (
            <div className="bg-surface border-2 border-border rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4">Game History</h2>
              <div className="space-y-2">
                {[...currentArena.games].reverse().map((game) => {
                  const winner = currentArena.players.find((p) => p.id === game.winnerId);
                  return (
                    <div
                      key={game.id}
                      className="flex items-center justify-between p-3 bg-background rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{game.gameName}</p>
                        <p className="text-sm text-text-secondary">
                          Winner: <span className="text-primary">{winner?.name}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => deleteGame(game.id)}
                        className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Arena Mode</h1>
        <button
          onClick={() => setView('setup')}
          className="p-3 bg-primary text-white rounded-lg hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {arenas.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-text-secondary" />
          <p className="text-text-secondary mb-4">No arenas yet</p>
          <button
            onClick={() => setView('setup')}
            className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all"
          >
            Create Your First Arena
          </button>
        </div>
      ) : (
        <div className="grid gap-4 max-w-2xl mx-auto">
          {arenas.map((arena) => {
            const arenaChampions = getChampions(arena);
            const totalGames = arena.games.length;

            return (
              <div
                key={arena.id}
                className="bg-surface border-2 border-border rounded-xl p-4 hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{arena.name}</h3>
                    <p className="text-text-secondary text-sm">
                      {arena.players.length} players · {totalGames}{' '}
                      {totalGames === 1 ? 'game' : 'games'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadArena(arena.id)}
                      className="p-2 hover:bg-background rounded-lg transition-colors"
                    >
                      <Trophy className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteArena(arena.id)}
                      className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {arenaChampions.length > 0 && totalGames > 0 && (
                  <div className="text-sm">
                    <span className="text-text-secondary">Champion: </span>
                    <span className="font-medium text-primary">
                      {arenaChampions.map((c) => c.name).join(', ')} ({arenaChampions[0].wins}{' '}
                      {arenaChampions[0].wins === 1 ? 'win' : 'wins'})
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

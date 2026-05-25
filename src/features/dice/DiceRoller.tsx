import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useDiceStore } from '../../stores/diceStore';
import type { DiceType } from '../../types';

const DICE_OPTIONS: DiceType[] = ['D2', 'D4', 'D6', 'D8', 'D10'];

export function Dice() {
  const {
    selectedDice,
    count,
    results,
    isRolling,
    history,
    selectDice,
    roll,
    clearHistory,
  } = useDiceStore();

  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      <h1 className="text-3xl font-bold mb-6 text-center">Dice Roller</h1>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Dice Type Selector */}
        <div>
          <label className="block text-sm font-medium mb-2">Dice Type</label>
          <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
            {DICE_OPTIONS.map((dice) => (
              <button
                key={dice}
                onClick={() => selectDice(dice)}
                className={`py-3 px-2 rounded-lg font-bold transition-all ${
                  selectedDice === dice
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-surface border-2 border-border hover:border-primary'
                }`}
              >
                {dice}
              </button>
            ))}
          </div>
        </div>


        {/* Roll Button */}
        <button
          onClick={roll}
          disabled={isRolling}
          className="w-full bg-primary text-white py-6 px-8 rounded-xl font-bold text-xl shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRolling ? 'Rolling...' : 'Roll'}
        </button>

        {/* Results Display */}
        <AnimatePresence mode="wait">
          {results.length > 0 && !isRolling && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-wrap gap-3 justify-center"
            >
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: index * 0.05,
                    type: 'spring',
                    stiffness: 200,
                    damping: 12,
                  }}
                  className="w-20 h-20 bg-primary text-white rounded-lg flex items-center justify-center text-3xl font-bold shadow-lg"
                >
                  {result}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Section */}
        {history.length > 0 && (
          <div className="bg-surface border-2 border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-background transition-colors"
            >
              <span className="font-semibold">
                Roll History ({history.length})
              </span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  showHistory ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-t-2 border-border p-4 max-h-96 overflow-y-auto space-y-3">
                    {history.map((roll) => (
                      <div
                        key={roll.id}
                        className="bg-background rounded-lg p-3"
                      >
                        <div className="flex flex-wrap gap-2">
                          {roll.results.map((result, idx) => (
                            <div
                              key={idx}
                              className="w-12 h-12 bg-primary text-white rounded-md flex items-center justify-center text-lg font-bold"
                            >
                              {result}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-border p-4">
                    <button
                      onClick={clearHistory}
                      className="w-full bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear History
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Info */}
        {results.length === 0 && (
          <div className="text-center text-text-secondary text-sm">
            <p>Select your dice type and count, then roll!</p>
            <p>History is saved automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
}

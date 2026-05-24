import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { useCoinStore } from '../../stores/coinStore';

export function Coin() {
  const { result, isFlipping, flip, reset } = useCoinStore();
  const [flipSide, setFlipSide] = useState<'H' | 'T'>('H');

  // Alternate coin face during flip
  useEffect(() => {
    if (!isFlipping) return;

    const interval = setInterval(() => {
      setFlipSide(prev => prev === 'H' ? 'T' : 'H');
    }, 100);

    return () => clearInterval(interval);
  }, [isFlipping]);

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
      <h1 className="text-3xl font-bold mb-8 text-center">Coin Flip</h1>

      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        {/* Coin Display */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isFlipping ? (
              <motion.div
                key="flipping"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 1800 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="w-48 h-48 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl border-4 border-amber-700"
              >
                <div className="text-white text-8xl font-bold">{flipSide}</div>
              </motion.div>
            ) : result ? (
              <motion.div
                key={result}
                initial={{ scale: 0, rotateY: 1800 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{
                  scale: { type: 'spring', stiffness: 200, damping: 15 },
                  rotateY: { duration: 0.3 }
                }}
                className={`w-48 h-48 rounded-full flex flex-col items-center justify-center shadow-2xl ${
                  result === 'heads' ? 'bg-blue-500' : 'bg-amber-500'
                }`}
              >
                <div className="text-6xl mb-2">
                  {result === 'heads' ? '👑' : '🦅'}
                </div>
                <div className="text-white text-2xl font-bold uppercase">
                  {result}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="initial"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-48 h-48 rounded-full bg-surface border-4 border-border flex items-center justify-center shadow-lg"
              >
                <div className="text-6xl">🪙</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Result Text */}
        <AnimatePresence>
          {result && !isFlipping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <p className="text-4xl font-bold text-primary mb-2">
                {result === 'heads' ? 'Heads!' : 'Tails!'}
              </p>
              <p className="text-text-secondary">
                Tap flip again or reset
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-4 w-full">
          <button
            onClick={flip}
            disabled={isFlipping}
            className="flex-1 bg-primary text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-touch"
          >
            {isFlipping ? 'Flipping...' : result ? 'Flip Again' : 'Flip Coin'}
          </button>

          {result && !isFlipping && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={reset}
              className="bg-surface border-2 border-border p-4 rounded-xl hover:bg-background active:scale-95 transition-all min-w-touch min-h-touch"
              aria-label="Reset"
            >
              <RotateCcw className="w-6 h-6" />
            </motion.button>
          )}
        </div>

        {/* Instructions */}
        {!result && !isFlipping && (
          <div className="text-center text-text-secondary text-sm">
            <p>Perfect for making quick decisions.</p>
            <p>Cryptographically random results.</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import type { Touch } from '../../types';

interface TouchCircleProps {
  touch: Touch;
  isLocked: boolean;
  isWinner: boolean;
  hasWinner?: boolean;
  position?: number;
}

export function TouchCircle({ touch, isLocked, isWinner, hasWinner = false, position }: TouchCircleProps) {
  // Hide non-winner circles when there's a winner
  if (hasWinner && !isWinner) {
    return null;
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{
        scale: 1,
        ...(isLocked && {
          scale: [1, 1.1, 1],
          transition: {
            repeat: isWinner ? 0 : Infinity,
            duration: 0.8,
          },
        }),
      }}
      style={{
        position: 'absolute',
        left: touch.x - 60,
        top: touch.y - 50,
        width: 120,
        height: 120,
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        border: `8px solid ${touch.color}`,
        pointerEvents: 'none',
        zIndex: isWinner ? 20 : (position !== undefined ? 15 : 10),
      }}
      className={`flex items-center justify-center ${
        isWinner ? 'shadow-2xl' : 'shadow-lg'
      }`}
    >
      {/* Glow effect for winner */}
      {isWinner && (
        <motion.div
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: touch.color,
          }}
        />
      )}

      {/* Position number or winner trophy */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold text-3xl relative z-10"
        style={{
          color: 'var(--color-text)',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
        }}
      >
        {isWinner ? '🏆' : position !== undefined ? position + 1 : ''}
      </motion.div>
    </motion.div>
  );
}

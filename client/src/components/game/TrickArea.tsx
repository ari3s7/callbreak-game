import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player, SUIT_SYMBOLS, TrickCard } from '@callbreak/shared';
import { PlayingCard } from '../card/PlayingCard.js';

interface TrickAreaProps {
  cards: TrickCard[];
  players: Player[];
  leadSuit: string | null;
  winnerId: string | null;
  humanPlayerSeat?: number;
}

export const TrickArea: React.FC<TrickAreaProps> = ({
  cards,
  players,
  leadSuit,
  winnerId,
  humanPlayerSeat = 0,
}) => {
  const getRelativePosition = (
    playerId: string
  ): 'bottom' | 'left' | 'top' | 'right' => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return 'bottom';
    const relSeat = (player.seat - humanPlayerSeat + 4) % 4;
    if (relSeat === 0) return 'bottom';
    if (relSeat === 1) return 'left';
    if (relSeat === 2) return 'top';
    return 'right';
  };

  const winnerPlayer = winnerId ? players.find((p) => p.id === winnerId) : null;

  return (
    <div className="relative w-[155px] h-[155px] xs:w-[180px] xs:h-[180px] sm:w-[230px] sm:h-[230px] md:w-[270px] md:h-[270px] border border-[#222C38]/90 rounded-full bg-[#11151C]/85 flex items-center justify-center p-2 backdrop-blur-md shadow-2xl flex-shrink-0">
      {/* Outer Tactical Circle Rings */}
      <div className="absolute inset-1.5 sm:inset-2.5 rounded-full border border-dashed border-[#222C38]/60 pointer-events-none" />
      <div className="absolute inset-6 sm:inset-10 rounded-full border border-[#222C38]/40 pointer-events-none" />

      {/* Trick Winner Announcement Banner */}
      {winnerPlayer && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-1/2 left-1/2 z-40 -translate-x-1/2 -translate-y-1/2 px-2.5 sm:px-3.5 py-1 rounded-md bg-[#0B0E13]/95 border border-[#00D5FF] text-[10px] sm:text-xs font-mono font-bold text-[#00D5FF] shadow-cyan-glow flex items-center space-x-1 whitespace-nowrap"
        >
          <span>🏆 WON BY</span>
          <span className="text-[#F1F5F9] truncate max-w-[90px] sm:max-w-none">{winnerPlayer.name}</span>
        </motion.div>
      )}

      {/* Cards in Trick placed at exact equidistant radial coordinates */}
      <AnimatePresence>
        {cards.map((tc) => {
          const pos = getRelativePosition(tc.playerId);
          const isWinner = winnerId === tc.playerId;

          let slotPositionClasses = '';
          let initialX = 0;
          let initialY = 0;

          if (pos === 'top') {
            slotPositionClasses = 'top-1.5 sm:top-2.5 left-1/2 -translate-x-1/2';
            initialY = -15;
          } else if (pos === 'bottom') {
            slotPositionClasses = 'bottom-1.5 sm:bottom-2.5 left-1/2 -translate-x-1/2';
            initialY = 15;
          } else if (pos === 'left') {
            slotPositionClasses = 'left-1.5 sm:left-2.5 top-1/2 -translate-y-1/2';
            initialX = -15;
          } else {
            slotPositionClasses = 'right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2';
            initialX = 15;
          }

          return (
            <div
              key={tc.card.id}
              className={`absolute ${slotPositionClasses} z-10 pointer-events-none ${
                isWinner ? '!z-20' : ''
              }`}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0, x: initialX, y: initialY }}
                animate={{ scale: isWinner ? 1.06 : 1, opacity: 1, x: 0, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="relative flex flex-col items-center pointer-events-auto"
              >
                <div
                  className={`transition-all duration-200 ${
                    isWinner ? 'ring-2 ring-[#00D5FF] rounded-lg shadow-cyan-glow' : ''
                  }`}
                >
                  <PlayingCard card={tc.card} size="sm" isPlayable={false} />
                </div>
              </motion.div>
            </div>
          );
        })}
      </AnimatePresence>

      {/* Empty Trick State Placeholder */}
      {cards.length === 0 && (
        <div className="text-center text-[8px] sm:text-xs font-mono text-[#647184]">
          <div className="text-[#222C38] text-lg sm:text-2xl mb-0.5">♠</div>
          <span>WAITING FOR LEAD</span>
        </div>
      )}
    </div>
  );
};

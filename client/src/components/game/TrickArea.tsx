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
    <div className="relative w-[150px] h-[150px] xs:w-[175px] xs:h-[175px] sm:w-[220px] sm:h-[220px] md:w-[260px] md:h-[260px] lg:w-[280px] lg:h-[280px] border border-[#222C38]/80 rounded-full bg-[#11151C]/75 flex items-center justify-center p-2 sm:p-3 backdrop-blur-md shadow-2xl flex-shrink-0">
      {/* Outer Tactical Circle Rings */}
      <div className="absolute inset-1.5 sm:inset-2 rounded-full border border-dashed border-[#222C38]/50 pointer-events-none" />
      <div className="absolute inset-6 sm:inset-10 rounded-full border border-[#222C38]/30 pointer-events-none" />

      {/* Lead Suit Indicator Badge (shown when trick in progress) */}
      {leadSuit && !winnerId && (
        <div className="absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded bg-[#161C25]/95 border border-[#222C38] text-[8px] xs:text-[9px] sm:text-[10px] font-mono text-[#A5AFBD] flex items-center space-x-1 sm:space-x-1.5 shadow-lg whitespace-nowrap pointer-events-none">
          <span className="text-[#647184] hidden xs:inline">LEAD:</span>
          <span className="text-[#00D5FF] font-bold">
            {SUIT_SYMBOLS[leadSuit as keyof typeof SUIT_SYMBOLS]} {leadSuit.toUpperCase()}
          </span>
        </div>
      )}

      {/* Trick Winner Announcement Banner */}
      {winnerPlayer && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-1/2 left-1/2 z-40 -translate-x-1/2 -translate-y-1/2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg bg-[#0B0E13]/95 border-2 border-[#00D5FF] text-[8px] xs:text-[10px] sm:text-xs font-mono font-bold text-[#00D5FF] shadow-cyan-glow flex items-center space-x-1 sm:space-x-1.5 whitespace-nowrap"
        >
          <span>🏆 WON BY</span>
          <span className="text-[#F1F5F9] truncate max-w-[80px] sm:max-w-none">{winnerPlayer.name}</span>
        </motion.div>
      )}

      {/* Cards in Trick placed at exact equidistant radial coordinates */}
      <AnimatePresence>
        {cards.map((tc) => {
          const pos = getRelativePosition(tc.playerId);
          const isWinner = winnerId === tc.playerId;
          const thrower = players.find((p) => p.id === tc.playerId);

          let slotPositionClasses = '';
          let initialX = 0;
          let initialY = 0;

          if (pos === 'top') {
            slotPositionClasses = 'top-1 sm:top-2.5 left-1/2 -translate-x-1/2';
            initialY = -20;
          } else if (pos === 'bottom') {
            slotPositionClasses = 'bottom-1 sm:bottom-2.5 left-1/2 -translate-x-1/2';
            initialY = 20;
          } else if (pos === 'left') {
            slotPositionClasses = 'left-1 sm:left-2.5 top-1/2 -translate-y-1/2';
            initialX = -20;
          } else {
            slotPositionClasses = 'right-1 sm:right-2.5 top-1/2 -translate-y-1/2';
            initialX = 20;
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
                animate={{ scale: isWinner ? 1.08 : 1, opacity: 1, x: 0, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="relative flex flex-col items-center pointer-events-auto"
              >
                {/* Floating Player Badge */}
                <div className="absolute -top-2.5 sm:-top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap z-20 px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded bg-[#0B0E13]/95 border border-[#222C38] text-[7px] sm:text-[9px] font-mono text-[#A5AFBD] font-semibold truncate max-w-[55px] sm:max-w-[80px] shadow-sm">
                  {thrower?.name || 'Player'}
                </div>

                <div
                  className={`transition-all duration-200 ${
                    isWinner ? 'ring-1 sm:ring-2 ring-[#00D5FF] rounded-lg shadow-cyan-glow' : ''
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
        <div className="text-center text-[9px] sm:text-xs font-mono text-[#647184]">
          <div className="text-[#222C38] text-xl sm:text-2xl mb-0.5 sm:mb-1">♠</div>
          <span>WAITING FOR LEAD</span>
        </div>
      )}
    </div>
  );
};

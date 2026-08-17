import React from 'react';
import { SUIT_SYMBOLS } from '@callbreak/shared';

interface HUDBarProps {
  currentRound: number;
  maxRounds: number;
  currentTrickNumber: number;
  isHumanTurn: boolean;
  currentTurnName: string;
  turnSecondsLeft: number;
  phase: string;
  leadSuit?: string | null;
}

export const HUDBar: React.FC<HUDBarProps> = ({
  currentRound,
  maxRounds,
  currentTrickNumber,
  isHumanTurn,
  currentTurnName,
  turnSecondsLeft,
  phase,
  leadSuit,
}) => {
  const isRedLead = leadSuit === 'hearts' || leadSuit === 'diamonds';

  return (
    <div className="w-full bg-[#11151C]/95 border-b border-[#222C38] px-2.5 sm:px-4 py-1 sm:py-1.5 select-none font-mono text-[10px] sm:text-xs">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-2">
        {/* Match Info & Mobile Turn Status */}
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start space-x-2 sm:space-x-3">
          {/* Round & Trick Counters */}
          <div className="flex items-center space-x-2">
            <div>
              <span className="text-[#647184] uppercase mr-1">RND</span>
              <span className="font-bold text-[#F1F5F9]">
                {currentRound.toString().padStart(2, '0')}/{maxRounds.toString().padStart(2, '0')}
              </span>
            </div>
            <div className="text-[#222C38]">|</div>
            <div>
              <span className="text-[#647184] uppercase mr-1">TRK</span>
              <span className="font-bold text-[#F1F5F9]">
                {currentTrickNumber.toString().padStart(2, '0')}/13
              </span>
            </div>
          </div>

          {/* Turn Notification on Mobile */}
          <div className="sm:hidden flex items-center">
            {phase === 'bidding' ? (
              <span className="px-1.5 py-0.5 rounded bg-[#00D5FF]/10 text-[#00D5FF] font-bold text-[9px] tracking-wide animate-pulse truncate max-w-[130px]">
                {currentTurnName} BID {turnSecondsLeft}s
              </span>
            ) : isHumanTurn ? (
              <span className="px-1.5 py-0.5 rounded bg-[#00D5FF]/15 text-[#00D5FF] font-bold text-[9px] tracking-wide animate-pulse border border-[#00D5FF]/40">
                YOUR TURN {turnSecondsLeft}s
              </span>
            ) : currentTurnName ? (
              <span className="px-1.5 py-0.5 rounded bg-[#161C25] text-[#A5AFBD] font-medium text-[9px] truncate max-w-[130px]">
                {currentTurnName} {turnSecondsLeft}s
              </span>
            ) : null}
          </div>
        </div>

        {/* Trump & Lead Pattern Badges */}
        <div className="flex items-center justify-center space-x-1.5 xs:space-x-2">
          {/* Permanent Trump */}
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-[#161C25] border border-[#222C38] text-[9px] xs:text-[10px] sm:text-xs">
            <span className="text-[#647184] text-[8px] xs:text-[9px]">TRUMP</span>
            <span className="text-[#00D5FF] font-bold">♠ SPADES</span>
          </div>

          {/* Current Lead Pattern (Only shown when active trick has lead) */}
          {leadSuit && (
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-[#161C25] border border-[#00D5FF]/40 text-[9px] xs:text-[10px] sm:text-xs animate-pulse">
              <span className="text-[#647184] text-[8px] xs:text-[9px]">LEAD</span>
              <span className={`font-bold ${isRedLead ? 'text-[#FF3B4E]' : 'text-[#00D5FF]'}`}>
                {SUIT_SYMBOLS[leadSuit as keyof typeof SUIT_SYMBOLS]} {leadSuit.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Turn Notification on sm+ (Tablet/Desktop) */}
        <div className="hidden sm:flex items-center justify-end">
          {phase === 'bidding' ? (
            <span className="px-2 py-1 rounded bg-[#00D5FF]/10 text-[#00D5FF] font-bold text-xs tracking-wider animate-pulse">
              {currentTurnName} BIDDING {turnSecondsLeft}s
            </span>
          ) : isHumanTurn ? (
            <span className="px-2.5 py-1 rounded bg-[#00D5FF]/15 text-[#00D5FF] font-bold text-xs tracking-wider animate-pulse border border-[#00D5FF]/50 shadow-cyan-glow">
              YOUR TURN {turnSecondsLeft}s
            </span>
          ) : currentTurnName ? (
            <span className="px-2 py-1 rounded bg-[#161C25] text-[#A5AFBD] font-medium text-xs">
              {currentTurnName} {turnSecondsLeft}s
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

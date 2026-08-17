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
    <div className="w-full bg-[#11151C]/90 border-b border-[#222C38] px-2 sm:px-4 py-1 sm:py-2 flex items-center justify-between text-[10px] sm:text-xs font-mono select-none">
      {/* Left Details */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div>
          <span className="text-[#647184] uppercase mr-1">RND</span>
          <span className="font-bold text-[#F1F5F9]">
            {currentRound.toString().padStart(2, '0')}/{maxRounds.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="text-[#222C38]">|</div>
        <div>
          <span className="text-[#647184] uppercase mr-1">TRICK</span>
          <span className="font-bold text-[#F1F5F9]">
            {currentTrickNumber.toString().padStart(2, '0')}/13
          </span>
        </div>
      </div>

      {/* Center Badges: Trump & Lead */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <div className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded bg-[#161C25] border border-[#222C38]">
          <span className="text-[#647184] hidden xs:inline">TRUMP</span>
          <span className="text-[#00D5FF] font-bold text-xs sm:text-sm">♠ SPADES</span>
        </div>

        {leadSuit && (
          <div className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded bg-[#161C25] border border-[#00D5FF]/40 animate-pulse">
            <span className="text-[#647184] hidden xs:inline">LEAD</span>
            <span className={`font-bold text-xs sm:text-sm ${isRedLead ? 'text-[#FF3B4E]' : 'text-[#00D5FF]'}`}>
              {SUIT_SYMBOLS[leadSuit as keyof typeof SUIT_SYMBOLS]} {leadSuit.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Right Turn Notification */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {phase === 'bidding' ? (
          <span className="text-[#00D5FF] font-bold tracking-wider animate-pulse leading-none truncate max-w-[120px] sm:max-w-none">
            {currentTurnName} BIDDING {turnSecondsLeft}s
          </span>
        ) : isHumanTurn ? (
          <span className="text-[#00D5FF] font-bold tracking-wider animate-pulse leading-none">
            YOUR TURN {turnSecondsLeft}s
          </span>
        ) : currentTurnName ? (
          <span className="text-[#00D5FF] font-bold tracking-wider animate-pulse leading-none truncate max-w-[120px] sm:max-w-none">
            {currentTurnName} {turnSecondsLeft}s
          </span>
        ) : null}
      </div>
    </div>
  );
};

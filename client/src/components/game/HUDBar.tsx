import React from 'react';

interface HUDBarProps {
  currentRound: number;
  maxRounds: number;
  currentTrickNumber: number;
  isHumanTurn: boolean;
  currentTurnName: string;
  turnSecondsLeft: number;
  phase: string;
}

export const HUDBar: React.FC<HUDBarProps> = ({
  currentRound,
  maxRounds,
  currentTrickNumber,
  isHumanTurn,
  currentTurnName,
  turnSecondsLeft,
  phase,
}) => {
  return (
    <div className="w-full bg-[#11151C]/90 border-b border-[#222C38] px-4 py-2 flex items-center justify-between text-xs font-mono select-none">
      {/* Left Details */}
      <div className="flex items-center space-x-4">
        <div>
          <span className="text-[#647184] uppercase mr-1.5">ROUND</span>
          <span className="font-bold text-[#F1F5F9]">
            {currentRound.toString().padStart(2, '0')} / {maxRounds.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="hidden sm:block text-[#222C38]">|</div>
        <div>
          <span className="text-[#647184] uppercase mr-1.5">TRICK</span>
          <span className="font-bold text-[#F1F5F9]">
            {currentTrickNumber.toString().padStart(2, '0')} / 13
          </span>
        </div>
      </div>

      {/* Center Trump Badge */}
      <div className="flex items-center space-x-1.5 px-3 py-1 rounded bg-[#161C25] border border-[#222C38]">
        <span className="text-[#647184]">TRUMP</span>
        <span className="text-[#00D5FF] font-bold text-sm">♠ SPADES</span>
      </div>

      {/* Right Turn Notification */}
      <div className="flex items-center space-x-2">
        {phase === 'bidding' ? (
          <span className="text-[#00D5FF] font-bold tracking-wider animate-pulse leading-none">
            {currentTurnName} BIDDING {turnSecondsLeft}s
          </span>
        ) : isHumanTurn ? (
          <span className="text-[#00D5FF] font-bold tracking-wider animate-pulse leading-none">
            YOUR TURN {turnSecondsLeft}s
          </span>
        ) : currentTurnName ? (
          <span className="text-[#00D5FF] font-bold tracking-wider animate-pulse leading-none">
            {currentTurnName} {turnSecondsLeft}s
          </span>
        ) : null}
      </div>
    </div>
  );
};

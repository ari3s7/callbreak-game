import React from 'react';
import { Player } from '@callbreak/shared';
import { Bot, User } from 'lucide-react';

interface PlayerSeatProps {
  player: Player;
  isCurrentTurn: boolean;
  position: 'top' | 'left' | 'right' | 'bottom';
  phase?: 'bidding' | 'playing' | 'round_end' | 'game_over';
}

export const PlayerSeat: React.FC<PlayerSeatProps> = ({
  player,
  isCurrentTurn,
  position,
  phase = 'playing',
}) => {
  const isSouth = position === 'bottom';

  return (
    <div
      className={`
        relative rounded-md sm:rounded-lg bg-[#161C25] border p-1 sm:p-1.5 md:p-2 min-w-[72px] xs:min-w-[85px] sm:min-w-[110px] md:min-w-[130px] transition-all duration-200 select-none shadow-md
        ${
          isCurrentTurn
            ? 'border-[#00D5FF] ring-1 sm:ring-2 ring-[#00D5FF]/40 shadow-cyan-glow bg-[#1A202A] scale-102 z-20'
            : 'border-[#222C38] opacity-90'
        }
      `}
    >
      {/* Turn Indicator Accent Line */}
      {isCurrentTurn && (
        <div className="absolute -top-[2px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#00B8E6] via-[#00D5FF] to-[#00B8E6] rounded-t-md sm:rounded-t-lg animate-pulse" />
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center min-w-0">
          <span
            className={`text-[8px] xs:text-[9px] sm:text-[11px] font-bold font-mono tracking-wide truncate max-w-[50px] xs:max-w-[65px] sm:max-w-[90px] md:max-w-[110px] ${
              isCurrentTurn ? 'text-[#00D5FF]' : 'text-[#F1F5F9]'
            }`}
          >
            {isSouth ? `${player.name} (YOU)` : player.name}
          </span>
        </div>

        {player.isAI ? (
          <span className="flex items-center gap-0.5 px-0.5 sm:px-1 py-0.2 rounded bg-[#00B8E6]/10 text-[7px] sm:text-[9px] font-mono text-[#00D5FF]">
            <Bot size={9} className="sm:w-[10px] sm:h-[10px]" /> <span className="hidden xs:inline">BOT</span>
          </span>
        ) : (
          <span className="flex items-center gap-0.5 px-0.5 sm:px-1 py-0.2 rounded bg-white/5 text-[7px] sm:text-[9px] font-mono text-[#A5AFBD]">
            <User size={9} className="sm:w-[10px] sm:h-[10px]" />
          </span>
        )}
      </div>

      {/* Active Turn Action Badge */}
      {isCurrentTurn && (
        <div className="mt-0.5 flex items-center justify-center py-0.2 px-0.5 rounded bg-[#00D5FF]/10 text-[7px] xs:text-[8px] sm:text-[9px] font-mono font-semibold text-[#00D5FF] animate-pulse">
          {phase === 'bidding' ? '▶ BIDDING' : '▶ PLAYING'}
        </div>
      )}

      {/* Seat Metrics */}
      <div className="mt-0.5 sm:mt-1 grid grid-cols-2 gap-0.5 sm:gap-1 text-[7px] xs:text-[8px] sm:text-[10px] font-mono border-t border-[#222C38] pt-0.5 sm:pt-1">
        <div>
          <span className="text-[#647184] uppercase block text-[6px] xs:text-[7px] sm:text-[8px]">CALL</span>
          <div className="font-bold text-[#00D5FF] text-[8px] xs:text-[9px] sm:text-xs">
            {player.call !== null ? player.call.toString().padStart(2, '0') : '--'}
          </div>
        </div>
        <div>
          <span className="text-[#647184] uppercase block text-[6px] xs:text-[7px] sm:text-[8px]">TRICKS</span>
          <div className="font-bold text-[#F1F5F9] text-[8px] xs:text-[9px] sm:text-xs">
            {player.tricksWon.toString().padStart(2, '0')}
          </div>
        </div>
      </div>
    </div>
  );
};

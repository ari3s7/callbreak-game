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
        relative rounded-lg bg-[#161C25] border p-2 sm:p-2.5 min-w-[95px] xs:min-w-[110px] sm:min-w-[130px] md:min-w-[145px] transition-all duration-200 select-none shadow-lg
        ${
          isCurrentTurn
            ? 'border-[#00D5FF] ring-2 ring-[#00D5FF]/40 shadow-cyan-glow bg-[#1A202A] scale-102 z-20'
            : 'border-[#222C38] opacity-95'
        }
      `}
    >
      {/* Turn Indicator Accent Line */}
      {isCurrentTurn && (
        <div className="absolute -top-[2px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#00B8E6] via-[#00D5FF] to-[#00B8E6] rounded-t-lg animate-pulse" />
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center min-w-0">
          <span
            className={`text-[10px] xs:text-[11px] sm:text-xs font-bold font-mono tracking-wide truncate max-w-[70px] xs:max-w-[85px] sm:max-w-[105px] md:max-w-[125px] ${
              isCurrentTurn ? 'text-[#00D5FF]' : 'text-[#F1F5F9]'
            }`}
          >
            {isSouth ? `${player.name} (YOU)` : player.name}
          </span>
        </div>

        {player.isAI ? (
          <span className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-[#00B8E6]/10 text-[8px] sm:text-[9px] font-mono text-[#00D5FF]">
            <Bot size={10} /> <span className="hidden xs:inline">BOT</span>
          </span>
        ) : (
          <span className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-white/5 text-[8px] sm:text-[9px] font-mono text-[#A5AFBD]">
            <User size={10} />
          </span>
        )}
      </div>

      {/* Active Turn Action Badge */}
      {isCurrentTurn && (
        <div className="mt-1 flex items-center justify-center py-0.5 px-1 rounded bg-[#00D5FF]/10 text-[8px] sm:text-[9px] font-mono font-semibold text-[#00D5FF] animate-pulse">
          {phase === 'bidding' ? '▶ BIDDING' : '▶ PLAYING'}
        </div>
      )}

      {/* Seat Metrics */}
      <div className="mt-1 sm:mt-1.5 grid grid-cols-2 gap-1 text-[8px] sm:text-[10px] font-mono border-t border-[#222C38] pt-1">
        <div>
          <span className="text-[#647184] uppercase block text-[7px] sm:text-[8px]">CALL</span>
          <div className="font-bold text-[#00D5FF] text-[10px] sm:text-xs">
            {player.call !== null ? player.call.toString().padStart(2, '0') : '--'}
          </div>
        </div>
        <div>
          <span className="text-[#647184] uppercase block text-[7px] sm:text-[8px]">TRICKS</span>
          <div className="font-bold text-[#F1F5F9] text-[10px] sm:text-xs">
            {player.tricksWon.toString().padStart(2, '0')}
          </div>
        </div>
      </div>
    </div>
  );
};

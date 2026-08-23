import React from 'react';
import { Player } from '@callbreak/shared';
import { Bot, User, Volume2, VolumeX, MicOff } from 'lucide-react';

interface PlayerSeatProps {
  player: Player;
  isCurrentTurn: boolean;
  position: 'top' | 'left' | 'right' | 'bottom';
  phase?: 'bidding' | 'playing' | 'round_end' | 'game_over';
  isSpeaking?: boolean;
  isVoiceMuted?: boolean;
  isPeerMutedByLocal?: boolean;
  onTogglePeerMute?: (userId: string) => void;
}

export const PlayerSeat: React.FC<PlayerSeatProps> = ({
  player,
  isCurrentTurn,
  position,
  phase = 'playing',
  isSpeaking = false,
  isVoiceMuted = false,
  isPeerMutedByLocal = false,
  onTogglePeerMute,
}) => {
  const isSouth = position === 'bottom';

  return (
    <div
      className={`
        relative rounded-md sm:rounded-lg bg-[#161C25] border p-1 xs:p-1.5 sm:p-2 w-[76px] xs:w-[86px] sm:w-[115px] md:w-[135px] transition-all duration-200 select-none shadow-md flex-shrink-0
        ${
          isSpeaking
            ? '!border-[#10B981] ring-2 ring-[#10B981]/60 shadow-[0_0_12px_rgba(16,185,129,0.45)] bg-[#12231E] z-30'
            : isCurrentTurn
            ? 'border-[#00D5FF] ring-1.5 sm:ring-2 ring-[#00D5FF]/40 shadow-cyan-glow bg-[#1A202A] z-20'
            : 'border-[#222C38] opacity-95'
        }
      `}
    >
      {/* Turn Indicator Accent Line */}
      {isCurrentTurn && !isSpeaking && (
        <div className="absolute -top-[2px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#00B8E6] via-[#00D5FF] to-[#00B8E6] rounded-t-md sm:rounded-t-lg animate-pulse" />
      )}

      {/* Speaking Accent Line */}
      {isSpeaking && (
        <div className="absolute -top-[2px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#10B981] rounded-t-md sm:rounded-t-lg animate-pulse" />
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center min-w-0 space-x-0.5">
          <span
            className={`text-[8px] xs:text-[9px] sm:text-xs font-bold font-mono tracking-wide truncate max-w-[42px] xs:max-w-[48px] sm:max-w-[75px] md:max-w-[95px] ${
              isSpeaking
                ? 'text-[#10B981]'
                : isCurrentTurn
                ? 'text-[#00D5FF]'
                : 'text-[#F1F5F9]'
            }`}
          >
            {isSouth ? `${player.name} (YOU)` : player.name}
          </span>
          {isSpeaking && (
            <span className="flex h-2 w-2 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-0.5 flex-shrink-0">
          {/* Peer Mute Toggle Button for Remote Players */}
          {!isSouth && !player.isAI && onTogglePeerMute && (
            <button
              type="button"
              onClick={() => onTogglePeerMute(player.id)}
              title={isPeerMutedByLocal ? 'Unmute Player' : 'Mute Player'}
              className="p-0.5 rounded text-[#A5AFBD] hover:text-white hover:bg-white/10 transition-colors"
            >
              {isPeerMutedByLocal ? (
                <VolumeX size={10} className="text-[#DC2626]" />
              ) : (
                <Volume2 size={10} className="text-[#A5AFBD]" />
              )}
            </button>
          )}

          {isVoiceMuted && <MicOff size={10} className="text-[#DC2626] flex-shrink-0" />}

          {player.isAI ? (
            <span className="flex items-center gap-0.5 px-0.5 py-0.2 rounded bg-[#00B8E6]/10 text-[7px] sm:text-[9px] font-mono text-[#00D5FF] flex-shrink-0">
              <Bot size={9} className="sm:w-[11px] sm:h-[11px]" /> <span className="hidden xs:inline">BOT</span>
            </span>
          ) : (
            <span className="flex items-center gap-0.5 px-0.5 py-0.2 rounded bg-white/5 text-[7px] sm:text-[9px] font-mono text-[#A5AFBD] flex-shrink-0">
              <User size={9} className="sm:w-[11px] sm:h-[11px]" />
            </span>
          )}
        </div>
      </div>

      {/* Active Turn Action / Speaking Badge */}
      {isSpeaking ? (
        <div className="mt-0.5 flex items-center justify-center py-0.2 px-0.5 rounded bg-[#10B981]/20 text-[7px] xs:text-[8px] sm:text-[9px] font-mono font-semibold text-[#10B981] animate-pulse">
          🎙️ SPEAKING
        </div>
      ) : (
        isCurrentTurn && (
          <div className="mt-0.5 flex items-center justify-center py-0.2 px-0.5 rounded bg-[#00D5FF]/10 text-[7px] xs:text-[8px] sm:text-[9px] font-mono font-semibold text-[#00D5FF] animate-pulse">
            {phase === 'bidding' ? '▶ BIDDING' : '▶ PLAYING'}
          </div>
        )
      )}

      {/* Seat Metrics */}
      <div className="mt-0.5 sm:mt-1 grid grid-cols-2 gap-0.5 text-[7px] xs:text-[8px] sm:text-[10px] font-mono border-t border-[#222C38] pt-0.5 sm:pt-1">
        <div>
          <span className="text-[#647184] uppercase block text-[6px] xs:text-[7px] sm:text-[8px] leading-tight">CALL</span>
          <div className="font-bold text-[#00D5FF] text-[8px] xs:text-[9px] sm:text-xs leading-tight">
            {player.call !== null ? player.call.toString().padStart(2, '0') : '--'}
          </div>
        </div>
        <div>
          <span className="text-[#647184] uppercase block text-[6px] xs:text-[7px] sm:text-[8px] leading-tight">TRICKS</span>
          <div className="font-bold text-[#F1F5F9] text-[8px] xs:text-[9px] sm:text-xs leading-tight">
            {player.tricksWon.toString().padStart(2, '0')}
          </div>
        </div>
      </div>
    </div>
  );
};

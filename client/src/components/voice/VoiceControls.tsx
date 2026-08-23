import React from 'react';
import { Mic, MicOff, Volume2, VolumeX, PhoneCall, PhoneOff } from 'lucide-react';

interface VoiceControlsProps {
  isJoined: boolean;
  isMuted: boolean;
  isDeafened: boolean;
  isMultiplayer: boolean;
  errorMsg?: string | null;
  onToggleVoice: () => void;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
  compact?: boolean;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isJoined,
  isMuted,
  isDeafened,
  isMultiplayer,
  errorMsg,
  onToggleVoice,
  onToggleMute,
  onToggleDeafen,
  compact = false,
}) => {
  return (
    <div className="relative flex items-center space-x-1 sm:space-x-1.5 select-none">
      {/* Voice Error Notification Toast */}
      {errorMsg && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 px-2.5 py-1 rounded bg-[#DC2626] text-white text-[10px] sm:text-xs font-mono shadow-lg whitespace-nowrap animate-bounce">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Main Voice Call Join / Leave Button */}
      <button
        type="button"
        onClick={onToggleVoice}
        title={isJoined ? 'Disconnect Voice Chat' : isMultiplayer ? 'Join Voice Chat' : 'Voice Chat (Multiplayer Only)'}
        className={`flex items-center space-x-1 px-2 py-1 rounded-md text-[10px] sm:text-xs font-mono font-bold transition-all duration-150 flex-shrink-0 ${
          isJoined
            ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/50 shadow-[0_0_10px_rgba(16,185,129,0.25)] hover:bg-[#10B981]/30'
            : isMultiplayer
            ? 'bg-[#161C25] text-[#00D5FF] border border-[#00D5FF]/40 hover:bg-[#00D5FF]/10 shadow-sm'
            : 'bg-[#161C25]/60 text-[#647184] border border-[#222C38] cursor-not-allowed opacity-70'
        }`}
      >
        {isJoined ? (
          <>
            <PhoneOff size={13} className="text-[#10B981] animate-pulse" />
            {!compact && <span className="hidden xs:inline">VOICE ON</span>}
          </>
        ) : (
          <>
            <PhoneCall size={13} className={isMultiplayer ? 'text-[#00D5FF]' : 'text-[#647184]'} />
            {!compact && <span className="hidden xs:inline">VOICE</span>}
          </>
        )}
      </button>

      {/* Mic Mute / Unmute Toggle Button */}
      {isJoined && (
        <>
          <button
            type="button"
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            className={`p-1.5 rounded-md border transition-all duration-150 flex-shrink-0 ${
              isMuted
                ? 'bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/60 shadow-[0_0_8px_rgba(220,38,38,0.3)]'
                : 'bg-[#161C25] text-[#00D5FF] border-[#00D5FF]/40 hover:bg-[#00D5FF]/10'
            }`}
          >
            {isMuted ? <MicOff size={13} /> : <Mic size={13} className="animate-pulse" />}
          </button>

          {/* Deafen Toggle Button */}
          <button
            type="button"
            onClick={onToggleDeafen}
            title={isDeafened ? 'Undeafen Incoming Audio' : 'Deafen Audio'}
            className={`p-1.5 rounded-md border transition-all duration-150 flex-shrink-0 ${
              isDeafened
                ? 'bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/60 shadow-[0_0_8px_rgba(220,38,38,0.3)]'
                : 'bg-[#161C25] text-[#A5AFBD] border-[#222C38] hover:text-white'
            }`}
          >
            {isDeafened ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
        </>
      )}
    </div>
  );
};

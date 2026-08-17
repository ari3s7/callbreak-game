import React from 'react';
import { Volume2, VolumeX, Trophy, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore.js';
import { useSoundStore } from '../../stores/soundStore.js';

interface NavbarProps {
  onNavigateHome?: () => void;
  onNavigateProfile?: () => void;
  onNavigateLeaderboard?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateHome,
  onNavigateProfile,
  onNavigateLeaderboard,
  onLogout,
}) => {
  const { user, logout } = useAuthStore();
  const { soundEnabled, toggleSound } = useSoundStore();

  return (
    <header className="w-full bg-[#11151C] border-b border-[#222C38] px-2.5 sm:px-4 py-1.5 sm:py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Header */}
        <div
          onClick={onNavigateHome}
          className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-[#161C25] border border-[#222C38] flex items-center justify-center text-[#00D5FF] text-sm sm:text-base font-bold font-display group-hover:border-[#00D5FF] transition-all">
            ♠
          </div>
          <div>
            <div className="text-sm sm:text-base md:text-lg font-bold font-display tracking-wider text-[#F1F5F9] group-hover:text-[#00D5FF] transition-all">
              CALL BREAK
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={toggleSound}
            className="p-1.5 sm:p-2 rounded bg-[#161C25] border border-[#222C38] text-[#A5AFBD] hover:text-[#00D5FF] hover:border-[#00D5FF] transition-all"
            title="Toggle Sound FX"
          >
            {soundEnabled ? <Volume2 size={16} className="sm:w-[18px] sm:h-[18px]" /> : <VolumeX size={16} className="sm:w-[18px] sm:h-[18px]" />}
          </button>

          <button
            onClick={onNavigateLeaderboard}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded bg-[#161C25] border border-[#222C38] text-[10px] sm:text-xs font-mono tracking-wider text-[#A5AFBD] hover:text-[#00D5FF] hover:border-[#00D5FF] transition-all"
          >
            <Trophy size={13} className="text-[#00D5FF] sm:w-[14px] sm:h-[14px]" />
            <span className="hidden sm:inline">RANKINGS</span>
          </button>

          {user ? (
            <div className="flex items-center space-x-1.5 sm:space-x-3">
              <button
                onClick={onNavigateProfile}
                className="flex items-center justify-center px-2 sm:px-3 py-1 sm:py-1.5 rounded bg-[#161C25] border border-[#00B8E6]/40 text-[10px] sm:text-xs font-mono text-[#F1F5F9] hover:border-[#00D5FF] transition-all max-w-[100px] sm:max-w-none truncate"
              >
                <span className="font-bold leading-none truncate">{user.username}</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  onLogout?.();
                }}
                className="p-1.5 sm:p-2 rounded bg-[#161C25] border border-[#222C38] text-[#647184] hover:text-[#FF3B4E] transition-all"
                title="Logout"
              >
                <LogOut size={14} className="sm:w-[16px] sm:h-[16px]" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

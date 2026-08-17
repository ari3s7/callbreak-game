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
    <header className="w-full bg-[#11151C] border-b border-[#222C38] px-4 py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Header */}
        <div
          onClick={onNavigateHome}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded bg-[#161C25] border border-[#222C38] flex items-center justify-center text-[#00D5FF] font-bold font-display group-hover:border-[#00D5FF] transition-all">
            ♠
          </div>
          <div>
            <div className="text-lg font-bold font-display tracking-wider text-[#F1F5F9] group-hover:text-[#00D5FF] transition-all">
              CALL BREAK
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSound}
            className="p-2 rounded bg-[#161C25] border border-[#222C38] text-[#A5AFBD] hover:text-[#00D5FF] hover:border-[#00D5FF] transition-all"
            title="Toggle Sound FX"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button
            onClick={onNavigateLeaderboard}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#161C25] border border-[#222C38] text-xs font-mono tracking-wider text-[#A5AFBD] hover:text-[#00D5FF] hover:border-[#00D5FF] transition-all"
          >
            <Trophy size={14} className="text-[#00D5FF]" />
            <span className="hidden sm:inline">RANKINGS</span>
          </button>

          {user ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={onNavigateProfile}
                className="flex items-center justify-center px-3 py-1.5 rounded bg-[#161C25] border border-[#00B8E6]/40 text-xs font-mono text-[#F1F5F9] hover:border-[#00D5FF] transition-all"
              >
                <span className="font-bold leading-none">{user.username}</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  onLogout?.();
                }}
                className="p-2 rounded bg-[#161C25] border border-[#222C38] text-[#647184] hover:text-[#FF3B4E] transition-all"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

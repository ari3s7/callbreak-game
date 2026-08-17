import React from 'react';
import { Trophy, RefreshCw, Home } from 'lucide-react';
import { Player } from '@callbreak/shared';

interface MatchResultsModalProps {
  players: Player[];
  winnerId: string | null;
  onPlayAgain: () => void;
  onReturnHome: () => void;
}

export const MatchResultsModal: React.FC<MatchResultsModalProps> = ({
  players,
  winnerId,
  onPlayAgain,
  onReturnHome,
}) => {
  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);
  const winner = sortedPlayers[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0E13]/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#11151C] border border-[#222C38] rounded-xl max-w-lg w-full p-3 sm:p-6 shadow-2xl my-auto">
        <div className="text-center mb-3 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#161C25] border border-[#00D5FF] mx-auto flex items-center justify-center text-[#00D5FF] mb-2 sm:mb-3 shadow-cyan-glow">
            <Trophy size={20} className="sm:w-[24px] sm:h-[24px]" />
          </div>
          <div className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#00D5FF] uppercase mb-0.5 sm:mb-1">
            MATCH COMPLETE
          </div>
          <h2 className="text-lg sm:text-2xl font-bold font-display text-[#F1F5F9]">
            {winner?.name} VICTORY!
          </h2>
          <p className="text-[10px] sm:text-xs text-[#A5AFBD] mt-0.5 sm:mt-1">
            Final Match Standings
          </p>
        </div>

        {/* Final Standings Table */}
        <div className="border border-[#222C38] rounded-lg bg-[#161C25] overflow-hidden mb-3 sm:mb-6">
          <table className="w-full text-left border-collapse text-[11px] sm:text-xs font-mono">
            <thead>
              <tr className="border-b border-[#222C38] text-[#647184] uppercase bg-[#11151C]/50">
                <th className="py-1.5 sm:py-2.5 px-3 sm:px-4">RANK</th>
                <th className="py-1.5 sm:py-2.5 px-3 sm:px-4">PLAYER</th>
                <th className="py-1.5 sm:py-2.5 px-3 sm:px-4 text-right">TOTAL SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222C38]">
              {sortedPlayers.map((p, index) => {
                const isWinner = index === 0;
                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-[#1A202A] transition-colors ${
                      isWinner ? 'bg-[#00B8E6]/10 font-bold' : ''
                    }`}
                  >
                    <td className="py-2 sm:py-3 px-3 sm:px-4 text-[#00D5FF]">#{index + 1}</td>
                    <td className="py-2 sm:py-3 px-3 sm:px-4 text-[#F1F5F9]">{p.name}</td>
                    <td className="py-2 sm:py-3 px-3 sm:px-4 text-right text-[#00D5FF]">
                      {p.totalScore.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            onClick={onPlayAgain}
            className="flex items-center justify-center space-x-1.5 sm:space-x-2 py-2.5 sm:py-3 rounded-lg bg-[#00B8E6] text-[#0B0E13] font-bold font-mono tracking-widest text-[11px] sm:text-xs uppercase hover:bg-[#00D5FF] transition-all active:scale-98"
          >
            <RefreshCw size={14} className="sm:w-[16px] sm:h-[16px]" />
            <span>PLAY AGAIN</span>
          </button>
          <button
            onClick={onReturnHome}
            className="flex items-center justify-center space-x-1.5 sm:space-x-2 py-2.5 sm:py-3 rounded-lg bg-[#161C25] border border-[#222C38] text-[#F1F5F9] font-bold font-mono tracking-widest text-[11px] sm:text-xs uppercase hover:border-[#00D5FF] hover:text-[#00D5FF] transition-all active:scale-98"
          >
            <Home size={14} className="sm:w-[16px] sm:h-[16px]" />
            <span>RETURN HOME</span>
          </button>
        </div>
      </div>
    </div>
  );
};

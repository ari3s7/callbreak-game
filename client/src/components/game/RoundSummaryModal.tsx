import React from 'react';
import { Player, RoundResult } from '@callbreak/shared';

interface RoundSummaryModalProps {
  roundResult: RoundResult;
  players: Player[];
  onNextRound: () => void;
}

export const RoundSummaryModal: React.FC<RoundSummaryModalProps> = ({
  roundResult,
  players,
  onNextRound,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0B0E13]/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#11151C] border border-[#222C38] rounded-xl max-w-lg w-full p-3 sm:p-6 shadow-2xl my-auto">
        <div className="text-center mb-3 sm:mb-6">
          <div className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#00D5FF] uppercase mb-0.5 sm:mb-1">
            ROUND {roundResult.roundNumber.toString().padStart(2, '0')} COMPLETE
          </div>
          <h2 className="text-lg sm:text-2xl font-bold font-display text-[#F1F5F9]">ROUND SUMMARY</h2>
        </div>

        {/* Round Breakdown Table */}
        <div className="border border-[#222C38] rounded-lg bg-[#161C25] overflow-hidden mb-3 sm:mb-6">
          <table className="w-full text-left border-collapse text-[11px] sm:text-xs font-mono">
            <thead>
              <tr className="border-b border-[#222C38] text-[#647184] uppercase bg-[#11151C]/50">
                <th className="py-1.5 sm:py-2.5 px-2.5 sm:px-4">PLAYER</th>
                <th className="py-1.5 sm:py-2.5 px-2 sm:px-3 text-center">CALL</th>
                <th className="py-1.5 sm:py-2.5 px-2 sm:px-3 text-center">WON</th>
                <th className="py-1.5 sm:py-2.5 px-2.5 sm:px-4 text-right">SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222C38]">
              {players.map((p) => {
                const rScore = roundResult.scores[p.id] || { call: 0, won: 0, score: 0 };
                const isPositive = rScore.score >= 0;

                return (
                  <tr key={p.id} className="hover:bg-[#1A202A] transition-colors">
                    <td className="py-2 sm:py-3 px-2.5 sm:px-4 font-bold text-[#F1F5F9]">{p.name}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-3 text-center text-[#A5AFBD]">{rScore.call}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-3 text-center text-[#A5AFBD]">{rScore.won}</td>
                    <td className={`py-2 sm:py-3 px-2.5 sm:px-4 text-right font-bold ${isPositive ? 'text-[#00D5FF]' : 'text-[#FF3B4E]'}`}>
                      {isPositive ? `+${rScore.score.toFixed(1)}` : rScore.score.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Cumulative Match Standings */}
        <div className="mb-3 sm:mb-6">
          <div className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#647184] uppercase mb-1.5 sm:mb-2">
            CUMULATIVE MATCH STANDINGS
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {players.map((p) => (
              <div key={p.id} className="bg-[#161C25] border border-[#222C38] p-1.5 sm:p-2 rounded flex justify-between items-center text-[10px] sm:text-xs font-mono">
                <span className="text-[#A5AFBD] truncate mr-1">{p.name}</span>
                <span className="font-bold text-[#00D5FF]">{p.totalScore.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onNextRound}
          className="w-full py-2.5 sm:py-3 rounded-lg bg-[#00B8E6] text-[#0B0E13] font-bold font-mono text-xs sm:text-sm tracking-widest uppercase hover:bg-[#00D5FF] transition-all shadow-md active:scale-98"
        >
          START NEXT ROUND
        </button>
      </div>
    </div>
  );
};

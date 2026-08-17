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
    <div className="fixed inset-0 z-50 bg-[#0B0E13]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#11151C] border border-[#222C38] rounded-xl max-w-lg w-full p-6 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-xs font-mono tracking-[0.25em] text-[#00D5FF] uppercase mb-1">
            ROUND {roundResult.roundNumber.toString().padStart(2, '0')} COMPLETE
          </div>
          <h2 className="text-2xl font-bold font-display text-[#F1F5F9]">ROUND SUMMARY</h2>
        </div>

        {/* Round Breakdown Table */}
        <div className="border border-[#222C38] rounded bg-[#161C25] overflow-hidden mb-6">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-[#222C38] text-[#647184] uppercase bg-[#11151C]/50">
                <th className="py-2.5 px-4">PLAYER</th>
                <th className="py-2.5 px-3 text-center">CALL</th>
                <th className="py-2.5 px-3 text-center">WON</th>
                <th className="py-2.5 px-4 text-right">SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222C38]">
              {players.map((p) => {
                const rScore = roundResult.scores[p.id] || { call: 0, won: 0, score: 0 };
                const isPositive = rScore.score >= 0;

                return (
                  <tr key={p.id} className="hover:bg-[#1A202A] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#F1F5F9]">{p.name}</td>
                    <td className="py-3 px-3 text-center text-[#A5AFBD]">{rScore.call}</td>
                    <td className="py-3 px-3 text-center text-[#A5AFBD]">{rScore.won}</td>
                    <td className={`py-3 px-4 text-right font-bold ${isPositive ? 'text-[#00D5FF]' : 'text-[#FF3B4E]'}`}>
                      {isPositive ? `+${rScore.score.toFixed(1)}` : rScore.score.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Cumulative Match Standings */}
        <div className="mb-6">
          <div className="text-[10px] font-mono tracking-widest text-[#647184] uppercase mb-2">
            CUMULATIVE MATCH STANDINGS
          </div>
          <div className="grid grid-cols-2 gap-2">
            {players.map((p) => (
              <div key={p.id} className="bg-[#161C25] border border-[#222C38] p-2 rounded flex justify-between items-center text-xs font-mono">
                <span className="text-[#A5AFBD] truncate">{p.name}</span>
                <span className="font-bold text-[#00D5FF]">{p.totalScore.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onNextRound}
          className="w-full py-3 rounded bg-[#00B8E6] text-[#0B0E13] font-bold font-mono tracking-widest uppercase hover:bg-[#00D5FF] transition-all shadow-md"
        >
          START NEXT ROUND
        </button>
      </div>
    </div>
  );
};

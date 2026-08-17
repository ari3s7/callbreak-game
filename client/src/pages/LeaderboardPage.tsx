import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { apiUrl } from '../config/apiConfig.js';

interface LeaderboardUser {
  rank: number;
  username: string;
  wins: number;
  gamesPlayed: number;
  winRate: number;
  totalScore: number;
}

export const LeaderboardPage: React.FC = () => {
  const [rankings, setRankings] = useState<LeaderboardUser[]>([
    { rank: 1, username: 'CYAN_TACTICIAN', wins: 142, gamesPlayed: 180, winRate: 78.8, totalScore: 1845.2 },
    { rank: 2, username: 'SPADE_MASTER', wins: 128, gamesPlayed: 175, winRate: 73.1, totalScore: 1690.4 },
    { rank: 3, username: 'APEX_CALLER', wins: 110, gamesPlayed: 160, winRate: 68.7, totalScore: 1420.0 },
    { rank: 4, username: 'NEXUS_ACE', wins: 95, gamesPlayed: 150, winRate: 63.3, totalScore: 1210.8 },
    { rank: 5, username: 'DARK_TRUMP', wins: 88, gamesPlayed: 145, winRate: 60.6, totalScore: 1140.2 },
  ]);

  useEffect(() => {
    fetch(apiUrl('/api/users/leaderboard'), { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.leaderboard) setRankings(data.leaderboard);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 tech-grid-bg">
      <div className="text-center mb-8">
        <div className="text-xs font-mono tracking-[0.25em] text-[#00D5FF] uppercase mb-1">
          GLOBAL RANKINGS
        </div>
        <h1 className="text-3xl font-bold font-display text-[#F1F5F9]">
          HALL OF FAME
        </h1>
        <p className="text-xs text-[#A5AFBD] font-mono mt-1">
          Top Call Break competitors ranked by lifetime rating score
        </p>
      </div>

      <div className="bg-[#11151C] border border-[#222C38] rounded-xl p-6 shadow-2xl">
        <div className="border border-[#222C38] rounded bg-[#161C25] overflow-hidden">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-[#222C38] text-[#647184] uppercase bg-[#11151C]/50">
                <th className="py-3 px-4">RANK</th>
                <th className="py-3 px-4">PLAYER</th>
                <th className="py-3 px-3 text-center">WINS</th>
                <th className="py-3 px-3 text-center">WIN RATE</th>
                <th className="py-3 px-4 text-right">RATING SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222C38]">
              {rankings.map((r) => {
                const isTop1 = r.rank === 1;
                const isTop3 = r.rank <= 3;

                return (
                  <tr
                    key={r.rank}
                    className={`hover:bg-[#1A202A] transition-colors ${
                      isTop1 ? 'bg-[#00B8E6]/10' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold flex items-center space-x-1.5">
                      {isTop1 ? (
                        <Trophy size={16} className="text-[#00D5FF]" />
                      ) : isTop3 ? (
                        <Medal size={16} className="text-[#A5AFBD]" />
                      ) : (
                        <Award size={16} className="text-[#647184]" />
                      )}
                      <span className={isTop1 ? 'text-[#00D5FF]' : 'text-[#A5AFBD]'}>
                        #{r.rank.toString().padStart(2, '0')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#F1F5F9]">{r.username}</td>
                    <td className="py-3.5 px-3 text-center text-[#A5AFBD]">{r.wins}</td>
                    <td className="py-3.5 px-3 text-center text-[#A5AFBD]">{r.winRate}%</td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#00D5FF]">
                      {r.totalScore.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

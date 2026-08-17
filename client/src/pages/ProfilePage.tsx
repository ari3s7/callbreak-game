import React, { useEffect, useState } from 'react';
import { Trophy, Award, Target, History, ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '../stores/authStore.js';
import { apiUrl } from '../config/apiConfig.js';

interface UserStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  totalScore: number;
  bestScore: number;
}

interface MatchHistoryItem {
  id: string;
  playedAt: string;
  players?: string[];
  finalRank: number;
  score: number;
  isWin: boolean;
}

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<UserStats>({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    totalScore: 0,
    bestScore: 0,
  });
  const [history, setHistory] = useState<MatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(apiUrl('/api/users/profile'), { credentials: 'include' })
        .then((res) => res.json())
        .then((data) => {
          if (data.stats) setStats(data.stats);
        }),
      fetch(apiUrl('/api/users/history'), { credentials: 'include' })
        .then((res) => res.json())
        .then((data) => {
          if (data.history) setHistory(data.history);
        }),
    ])
      .catch((err) => console.error('Error loading profile:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 tech-grid-bg">
      {/* User Header */}
      <div className="bg-[#11151C] border border-[#222C38] rounded-xl p-6 mb-8 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-[#161C25] border border-[#00D5FF] flex items-center justify-center text-[#00D5FF] text-2xl font-bold font-display shadow-cyan-glow">
            {user?.username?.substring(0, 2).toUpperCase() || 'CB'}
          </div>
          <div>
            <div className="text-[10px] font-mono tracking-[0.25em] text-[#00D5FF] uppercase mb-1">
              PLAYER PROFILE
            </div>
            <h1 className="text-2xl font-bold font-display text-[#F1F5F9]">
              {user?.username || 'PLAYER'}
            </h1>
            <p className="text-xs text-[#647184] font-mono mt-0.5">
              {user?.email || 'player@callbreak.io'}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#11151C] border border-[#222C38] p-4 rounded-xl">
          <div className="text-[10px] font-mono text-[#647184] uppercase mb-1 flex items-center justify-between">
            <span>GAMES PLAYED</span>
            <Target size={14} className="text-[#00D5FF]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#F1F5F9]">
            {loading ? '--' : stats.gamesPlayed}
          </div>
        </div>

        <div className="bg-[#11151C] border border-[#222C38] p-4 rounded-xl">
          <div className="text-[10px] font-mono text-[#647184] uppercase mb-1 flex items-center justify-between">
            <span>TOTAL WINS</span>
            <Trophy size={14} className="text-[#00D5FF]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#00D5FF]">
            {loading ? '--' : stats.wins}
          </div>
        </div>

        <div className="bg-[#11151C] border border-[#222C38] p-4 rounded-xl">
          <div className="text-[10px] font-mono text-[#647184] uppercase mb-1 flex items-center justify-between">
            <span>WIN RATE</span>
            <Award size={14} className="text-[#00D5FF]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#F1F5F9]">
            {loading ? '--' : `${stats.winRate}%`}
          </div>
        </div>

        <div className="bg-[#11151C] border border-[#222C38] p-4 rounded-xl">
          <div className="text-[10px] font-mono text-[#647184] uppercase mb-1 flex items-center justify-between">
            <span>BEST SCORE</span>
            <ArrowUpRight size={14} className="text-[#00D5FF]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#00D5FF]">
            {loading ? '--' : stats.bestScore}
          </div>
        </div>
      </div>

      {/* History Log */}
      <div className="bg-[#11151C] border border-[#222C38] rounded-xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#647184] uppercase mb-4">
          <History size={16} className="text-[#00D5FF]" />
          <span className="font-bold text-[#F1F5F9]">RECENT MATCH HISTORY</span>
        </div>

        {history.length === 0 ? (
          <div className="border border-[#222C38] rounded bg-[#161C25] p-8 text-center">
            <div className="text-2xl text-[#647184] mb-2">♠</div>
            <div className="text-xs font-mono text-[#A5AFBD] mb-1">NO MATCHES PLAYED YET</div>
            <div className="text-[11px] font-mono text-[#647184]">
              Jump into a game against bots or join a multiplayer room to record your stats.
            </div>
          </div>
        ) : (
          <div className="border border-[#222C38] rounded bg-[#161C25] overflow-hidden">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-[#222C38] text-[#647184] uppercase bg-[#11151C]/50">
                  <th className="py-2.5 px-4">RESULT</th>
                  <th className="py-2.5 px-4">FINAL RANK</th>
                  <th className="py-2.5 px-4">PLAYED AT</th>
                  <th className="py-2.5 px-4 text-right">SCORE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222C38]">
                {history.map((h) => (
                  <tr key={h.id} className="hover:bg-[#1A202A] transition-colors">
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          h.isWin
                            ? 'bg-[#00B8E6]/20 text-[#00D5FF] border border-[#00B8E6]/40'
                            : 'bg-[#FF3B4E]/10 text-[#FF3B4E] border border-[#FF3B4E]/40'
                        }`}
                      >
                        {h.isWin ? 'WIN' : 'LOSS'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#F1F5F9]">RANK #{h.finalRank}</td>
                    <td className="py-3 px-4 text-[#647184]">
                      {new Date(h.playedAt).toLocaleDateString()} {new Date(h.playedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-bold ${
                        h.score >= 0 ? 'text-[#00D5FF]' : 'text-[#FF3B4E]'
                      }`}
                    >
                      {h.score >= 0 ? `+${h.score}` : h.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

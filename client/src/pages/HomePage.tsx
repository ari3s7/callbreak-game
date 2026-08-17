import React, { useState } from 'react';
import { Play, Users, Key, Zap, Shield, Trophy } from 'lucide-react';
import { useAuthStore } from '../stores/authStore.js';
import { soundFx } from '../audio/soundSystem.js';

interface HomePageProps {
  onStartVsAI: (difficulty: 'easy' | 'medium' | 'hard', rounds: number) => void;
  onCreateRoom: () => void;
  onJoinRoom: (code: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartVsAI,
  onCreateRoom,
  onJoinRoom,
}) => {
  const [roomCode, setRoomCode] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [rounds, setRounds] = useState<number>(1);
  const [showJoinInput, setShowJoinInput] = useState(false);

  const { user } = useAuthStore();

  return (
    <div className="min-h-[calc(100vh-65px)] tech-grid-bg flex flex-col justify-between p-4 sm:p-8">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto w-full my-auto text-center py-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#161C25] border border-[#222C38] text-[11px] font-mono tracking-[0.25em] text-[#00D5FF] uppercase mb-4 shadow-cyan-sm">
          <span>● COMPONENT ENGINE v1.0</span>
          <span>|</span>
          <span>CALL BREAK TRADITIONAL</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-bold font-display tracking-tight text-[#F1F5F9] leading-none mb-3">
          CALL <span className="text-[#00D5FF]">BREAK</span>
        </h1>

        <p className="text-sm sm:text-base text-[#A5AFBD] max-w-lg mx-auto font-sans mb-6">
          Think ahead. Read the table. Take the trick. Experience standard Call Break with pure engine logic, intelligent AI, and real-time multiplayer.
        </p>

        {/* Action Button Grid */}
        <div className="max-w-md mx-auto space-y-4">
          {/* Quick Play VS AI */}
          <div className="bg-[#11151C] border border-[#222C38] rounded-xl p-4 shadow-xl">
            {/* Rounds Selector */}
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-[#647184]">
              <span className="uppercase tracking-wider">MATCH ROUNDS</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      soundFx.playCardClick();
                      setRounds(r);
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all border ${
                      rounds === r
                        ? 'bg-[#00D5FF] text-[#0B0E13] border-[#00D5FF] shadow-cyan-sm scale-105'
                        : 'bg-[#161C25] text-[#A5AFBD] border-[#222C38] hover:border-[#00D5FF]'
                    }`}
                  >
                    {r} {r === 1 ? 'RND' : 'RNDS'}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Difficulty Selector */}
            <div className="flex items-center justify-between mb-4 text-xs font-mono text-[#647184]">
              <span className="uppercase tracking-wider">BOT DIFFICULTY</span>
              <div className="flex space-x-1">
                {(['easy', 'medium', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      soundFx.playCardClick();
                      setDifficulty(d);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-all ${
                      difficulty === d
                        ? 'bg-[#00B8E6] text-[#0B0E13]'
                        : 'bg-[#161C25] text-[#647184] hover:text-[#A5AFBD]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playCardClick();
                onStartVsAI(difficulty, rounds);
              }}
              className="w-full py-3.5 rounded bg-[#00B8E6] text-[#0B0E13] font-bold font-mono tracking-widest text-sm uppercase hover:bg-[#00D5FF] transition-all flex items-center justify-center space-x-2 shadow-cyan-glow"
            >
              <Play size={18} fill="#0B0E13" />
              <span>PLAY VS BOTS ({rounds} {rounds === 1 ? 'ROUND' : 'ROUNDS'})</span>
            </button>
          </div>

          {/* Multiplayer Room Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                soundFx.playCardClick();
                onCreateRoom();
              }}
              className="py-3 rounded bg-[#161C25] border border-[#222C38] text-[#F1F5F9] font-bold font-mono tracking-wider text-xs uppercase hover:border-[#00D5FF] hover:text-[#00D5FF] transition-all flex items-center justify-center space-x-2"
            >
              <Users size={16} />
              <span>CREATE ROOM</span>
            </button>

            <button
              onClick={() => {
                soundFx.playCardClick();
                setShowJoinInput(!showJoinInput);
              }}
              className="py-3 rounded bg-[#161C25] border border-[#222C38] text-[#F1F5F9] font-bold font-mono tracking-wider text-xs uppercase hover:border-[#00D5FF] hover:text-[#00D5FF] transition-all flex items-center justify-center space-x-2"
            >
              <Key size={16} />
              <span>JOIN ROOM</span>
            </button>
          </div>

          {/* Join Room Code Input Drawer */}
          {showJoinInput && (
            <div className="p-3 rounded bg-[#11151C] border border-[#222C38] flex space-x-2">
              <input
                type="text"
                maxLength={6}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="ENTER ROOM CODE"
                className="flex-1 bg-[#161C25] border border-[#222C38] rounded px-3 py-2 text-xs font-mono tracking-widest uppercase text-[#F1F5F9] focus:outline-none focus:border-[#00D5FF]"
              />
              <button
                onClick={() => {
                  if (roomCode.length === 6) {
                    onJoinRoom(roomCode);
                  }
                }}
                disabled={roomCode.length !== 6}
                className="px-4 py-2 rounded bg-[#00B8E6] text-[#0B0E13] font-bold font-mono text-xs uppercase hover:bg-[#00D5FF] transition-all disabled:opacity-50"
              >
                JOIN
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feature Grid Footer */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[#222C38]/60 text-xs font-mono text-[#647184]">
        <div className="flex items-start space-x-3 p-3 rounded bg-[#11151C]/40 border border-[#222C38]/40">
          <Zap size={18} className="text-[#00D5FF] flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-[#F1F5F9] mb-0.5">PURE GAME ENGINE</div>
            <div>Deterministic rules, unbiased Fisher-Yates shuffle, and standard trick-taking logic.</div>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-3 rounded bg-[#11151C]/40 border border-[#222C38]/40">
          <Shield size={18} className="text-[#00D5FF] flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-[#F1F5F9] mb-0.5">AUTHENTIC CARDS</div>
            <div>Bicycle-inspired vector playing cards with large spade Ace and mirrored J/Q/K illustrations.</div>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-3 rounded bg-[#11151C]/40 border border-[#222C38]/40">
          <Trophy size={18} className="text-[#00D5FF] flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-[#F1F5F9] mb-0.5">SMART AI & REALTIME</div>
            <div>Adaptive easy/medium/hard bot algorithms and real-time Socket.IO room synchronization.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

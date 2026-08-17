import React, { useState } from 'react';
import { Copy, Play, UserCheck, Bot, Clock } from 'lucide-react';
import { Room } from '@callbreak/shared';
import { soundFx } from '../audio/soundSystem.js';

interface LobbyPageProps {
  room: Room;
  currentUserId: string;
  onReady: () => void;
  onStartGame: (rounds?: number) => void;
}

export const LobbyPage: React.FC<LobbyPageProps> = ({
  room,
  currentUserId,
  onReady,
  onStartGame,
}) => {
  const [rounds, setRounds] = useState<number>(1);
  const isHost = room.hostId === currentUserId;
  const isReady = room.players.find((p) => p.id === currentUserId)?.isReady || false;

  const copyCode = () => {
    soundFx.playCardClick();
    navigator.clipboard.writeText(room.code);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 tech-grid-bg">
      <div className="bg-[#11151C] border border-[#222C38] rounded-xl p-6 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-[10px] font-mono tracking-[0.25em] text-[#00D5FF] uppercase mb-1">
            MULTIPLAYER LOBBY
          </div>
          <h1 className="text-3xl font-bold font-display text-[#F1F5F9] mb-3">
            ROOM CODE: <span className="text-[#00D5FF]">{room.code}</span>
          </h1>

          <button
            onClick={copyCode}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded bg-[#161C25] border border-[#222C38] text-xs font-mono text-[#A5AFBD] hover:text-[#00D5FF] hover:border-[#00D5FF] transition-all"
          >
            <Copy size={14} />
            <span>COPY ROOM CODE</span>
          </button>
        </div>

        {/* Round selection for Room Host */}
        {isHost && (
          <div className="bg-[#161C25] border border-[#222C38] rounded p-3 mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#A5AFBD]">
              <Clock size={14} className="text-[#00D5FF]" />
              <span className="font-bold text-[#F1F5F9]">MATCH ROUNDS:</span>
            </div>

            <div className="flex space-x-1">
              {[1, 2, 3, 5].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    soundFx.playCardClick();
                    setRounds(r);
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all border ${
                    rounds === r
                      ? 'bg-[#00D5FF] text-[#0B0E13] border-[#00D5FF]'
                      : 'bg-[#11151C] text-[#A5AFBD] border-[#222C38] hover:border-[#00D5FF]'
                  }`}
                >
                  {r} {r === 1 ? 'RND' : 'RNDS'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Player List Seats (4 Seats) */}
        <div className="space-y-3 mb-6">
          {Array.from({ length: 4 }).map((_, index) => {
            const player = room.players[index];
            return (
              <div
                key={index}
                className="bg-[#161C25] border border-[#222C38] rounded p-3 flex items-center justify-between font-mono text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      player
                        ? player.isReady
                          ? 'bg-[#00D5FF]'
                          : 'bg-[#FF3B4E]'
                        : 'bg-[#647184]'
                    }`}
                  />
                  {player ? (
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-[#F1F5F9]">{player.name}</span>
                      {player.isHost && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00B8E6]/20 border border-[#00B8E6]/40 text-[#00D5FF]">
                          HOST
                        </span>
                      )}
                      {player.isAI && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#11151C] text-[#A5AFBD] flex items-center space-x-1">
                          <Bot size={12} />
                          <span>BOT</span>
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[#647184]">○ WAITING FOR PLAYER...</span>
                  )}
                </div>

                {player && (
                  <span className={player.isReady ? 'text-[#00D5FF]' : 'text-[#647184]'}>
                    {player.isReady ? 'READY' : 'NOT READY'}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Lobby Controls */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              soundFx.playCardClick();
              onReady();
            }}
            className={`py-3 rounded font-mono font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center space-x-2 ${
              isReady
                ? 'bg-[#161C25] text-[#00D5FF] border border-[#00D5FF]'
                : 'bg-[#161C25] text-[#F1F5F9] border border-[#222C38] hover:border-[#00D5FF]'
            }`}
          >
            <UserCheck size={16} />
            <span>{isReady ? 'READY!' : 'TOGGLE READY'}</span>
          </button>

          {isHost && (
            <button
              onClick={() => {
                soundFx.playCardClick();
                onStartGame(rounds);
              }}
              className="py-3 rounded bg-[#00B8E6] text-[#0B0E13] font-bold font-mono tracking-widest text-xs uppercase hover:bg-[#00D5FF] transition-all flex items-center justify-center space-x-2 shadow-cyan-glow"
            >
              <Play size={16} fill="#0B0E13" />
              <span>START GAME ({rounds} {rounds === 1 ? 'RND' : 'RNDS'})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

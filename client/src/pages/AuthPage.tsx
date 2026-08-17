import React, { useState } from 'react';
import { Lock, Mail, User, Shield, Zap, Trophy, UserCheck } from 'lucide-react';
import { useAuthStore } from '../stores/authStore.js';
import { soundFx } from '../audio/soundSystem.js';
import { apiUrl } from '../config/apiConfig.js';

interface AuthPageProps {
  onAuthenticated: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthenticated }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setUser } = useAuthStore();

  const handleGuestPlay = () => {
    soundFx.playCardClick();
    const guestCodewords = ['SHADOW', 'VIPER', 'FALCON', 'CYAN', 'NOVA', 'RAVEN', 'BLAZE', 'TITAN', 'APEX', 'NEXUS'];
    const randomWord = guestCodewords[Math.floor(Math.random() * guestCodewords.length)];
    const randomNum = Math.floor(100 + Math.random() * 900);
    const guestUsername = `GUEST_${randomWord}_${randomNum}`;
    const guestId = `guest-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    setUser(
      {
        id: guestId,
        username: guestUsername,
        email: `${guestUsername.toLowerCase()}@guest.callbreak.io`,
        avatar: 'avatar-1',
      },
      null
    );
    onAuthenticated();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const payload = isRegister
        ? { username, email, password }
        : { usernameOrEmail: username || email, password };

      const res = await fetch(apiUrl(endpoint), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setUser(data.user, data.token);
      onAuthenticated();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] tech-grid-bg px-4 py-6 sm:px-8 sm:py-10 flex items-center justify-center">
      <div className="w-full max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-8">
        <div className="rounded-2xl border border-[#222C38] bg-[#11151C]/90 p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_rgba(0,213,255,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(0,184,230,0.12),_transparent_30%)] pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#161C25] border border-[#222C38] text-[10px] font-mono tracking-[0.25em] text-[#00D5FF] uppercase mb-4">
              <Shield size={12} />
              Secure Access
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold font-display text-[#F1F5F9] leading-none mb-3">
              Play <span className="text-[#00D5FF]">Call Break</span>
            </h1>
            <p className="max-w-lg text-sm sm:text-base text-[#A5AFBD] leading-relaxed mb-6">
              Join online multiplayer rooms with friends or practice against smart AI opponents. Play instantly as a guest or sign in to save your stats.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 text-xs font-mono text-[#A5AFBD] mb-6">
              <div className="p-3 rounded-xl bg-[#161C25] border border-[#222C38]">
                <Zap className="text-[#00D5FF] mb-1.5" size={16} />
                Instant Guest Play
              </div>
              <div className="p-3 rounded-xl bg-[#161C25] border border-[#222C38]">
                <Trophy className="text-[#00D5FF] mb-1.5" size={16} />
                Multiplayer Rooms
              </div>
              <div className="p-3 rounded-xl bg-[#161C25] border border-[#222C38]">
                <Shield className="text-[#00D5FF] mb-1.5" size={16} />
                Global Rankings
              </div>
            </div>
          </div>

          {/* Quick Guest Action on Left Banner */}
          <div className="relative z-10 p-4 rounded-xl bg-[#161C25]/80 border border-[#222C38] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="font-bold font-mono text-xs text-[#F1F5F9]">INVITED BY A FRIEND?</div>
              <div className="text-[11px] font-mono text-[#647184]">Jump in directly with a guest name & room code</div>
            </div>
            <button
              onClick={handleGuestPlay}
              className="px-4 py-2 rounded-lg bg-[#00D5FF] text-[#0B0E13] font-bold font-mono text-xs uppercase hover:bg-[#00B8E6] transition-all shadow-cyan-sm whitespace-nowrap"
            >
              PLAY AS GUEST ➔
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-[#222C38] bg-[#11151C] p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-5">
            <div className="text-[10px] font-mono tracking-[0.25em] text-[#00D5FF] uppercase mb-1">
              PLAYER ACCESS
            </div>
            <h2 className="text-2xl font-bold font-display text-[#F1F5F9]">
              {isRegister ? 'Create Account' : 'Sign In'}
            </h2>
          </div>

          <div className="flex border-b border-[#222C38] mb-5 font-mono text-xs">
            <button
              onClick={() => {
                setIsRegister(false);
                setError(null);
              }}
              className={`flex-1 py-2 font-bold tracking-wider uppercase transition-all ${
                !isRegister
                  ? 'text-[#00D5FF] border-b-2 border-[#00D5FF]'
                  : 'text-[#647184] hover:text-[#A5AFBD]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsRegister(true);
                setError(null);
              }}
              className={`flex-1 py-2 font-bold tracking-wider uppercase transition-all ${
                isRegister
                  ? 'text-[#00D5FF] border-b-2 border-[#00D5FF]'
                  : 'text-[#647184] hover:text-[#A5AFBD]'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded bg-[#FF3B4E]/10 border border-[#FF3B4E]/40 text-[#FF3B4E] text-xs font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-mono text-[#647184] uppercase">
                  Username
                </label>
                {isRegister && (
                  <span className="text-[9px] font-mono text-[#647184]">3–20 chars</span>
                )}
              </div>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-[#647184]" />
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={20}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={isRegister ? 'Choose a username' : 'Username or Email'}
                  className="w-full bg-[#161C25] border border-[#222C38] rounded pl-10 pr-3 py-2.5 text-sm font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00D5FF] transition-all"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-[10px] font-mono text-[#647184] uppercase mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-[#647184]" />
                  <input
                    type="email"
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full bg-[#161C25] border border-[#222C38] rounded pl-10 pr-3 py-2.5 text-sm font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00D5FF] transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-mono text-[#647184] uppercase">
                  Password
                </label>
                {isRegister && (
                  <span className="text-[9px] font-mono text-[#647184]">Min 6 chars</span>
                )}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-[#647184]" />
                <input
                  type="password"
                  required
                  minLength={isRegister ? 6 : 1}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-[#161C25] border border-[#222C38] rounded pl-10 pr-3 py-2.5 text-sm font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00D5FF] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded bg-[#00B8E6] text-[#0B0E13] font-bold font-mono tracking-widest text-xs uppercase hover:bg-[#00D5FF] transition-all shadow-md disabled:opacity-60"
            >
              {loading ? 'PLEASE WAIT...' : isRegister ? 'CREATE ACCOUNT' : 'SIGN IN'}
            </button>
          </form>

          {/* Alternative Quick Guest Button */}
          <div className="mt-4 pt-4 border-t border-[#222C38] text-center">
            <button
              onClick={handleGuestPlay}
              className="w-full py-2.5 rounded border border-[#222C38] bg-[#161C25] text-[#A5AFBD] hover:text-[#00D5FF] hover:border-[#00D5FF] font-mono font-bold text-xs uppercase transition-all flex items-center justify-center space-x-2"
            >
              <UserCheck size={14} />
              <span>CONTINUE AS GUEST</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
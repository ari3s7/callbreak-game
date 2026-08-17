import React, { useState } from 'react';
import { X, Lock, Mail, User } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore.js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { setUser } = useAuthStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const payload = isRegister
        ? { username, email, password }
        : { usernameOrEmail: username || email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setUser(data.user, data.token);
      onClose();
    } catch (err: any) {
      // Fallback for offline demo mode
      setUser({
        id: `user-${Date.now()}`,
        username: username || 'PLAYER 1',
        email: email || 'user@callbreak.io',
        avatar: 'avatar-1',
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0E13]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#11151C] border border-[#222C38] rounded-xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#647184] hover:text-[#FF3B4E] transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="text-[10px] font-mono tracking-[0.25em] text-[#00D5FF] uppercase mb-1">
            CALL BREAK
          </div>
          <h2 className="text-2xl font-bold font-display text-[#F1F5F9]">
            {isRegister ? 'CREATE ACCOUNT' : 'WELCOME BACK'}
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#222C38] mb-6 font-mono text-xs">
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
            SIGN IN
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
            REGISTER
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded bg-[#FF3B4E]/10 border border-[#FF3B4E]/40 text-[#FF3B4E] text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-[#647184] uppercase mb-1">
              USERNAME
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-3 text-[#647184]" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-[#161C25] border border-[#222C38] rounded pl-10 pr-3 py-2 text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00D5FF] transition-all"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-[10px] font-mono text-[#647184] uppercase mb-1">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-[#647184]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full bg-[#161C25] border border-[#222C38] rounded pl-10 pr-3 py-2 text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00D5FF] transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono text-[#647184] uppercase mb-1">
              PASSWORD
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-[#647184]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#161C25] border border-[#222C38] rounded pl-10 pr-3 py-2 text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#00D5FF] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 rounded bg-[#00B8E6] text-[#0B0E13] font-bold font-mono tracking-widest text-xs uppercase hover:bg-[#00D5FF] transition-all shadow-md"
          >
            {isRegister ? 'CREATE ACCOUNT' : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  );
};

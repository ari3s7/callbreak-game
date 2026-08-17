import { create } from 'zustand';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setUser: (user: AuthUser | null, token?: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user, token = null) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));

import { create } from 'zustand';
import { soundFx } from '../audio/soundSystem.js';

interface SoundState {
  soundEnabled: boolean;
  toggleSound: () => void;
}

export const useSoundStore = create<SoundState>((set) => ({
  soundEnabled: true,
  toggleSound: () =>
    set((state) => {
      const next = !state.soundEnabled;
      soundFx.enabled = next;
      return { soundEnabled: next };
    }),
}));

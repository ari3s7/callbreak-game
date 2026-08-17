import { GameState } from '@callbreak/shared';
import { create } from 'zustand';

interface GameStoreState {
  gameState: GameState | null;
  selectedCardId: string | null;
  isVsAI: boolean;
  aiDifficulty: 'easy' | 'medium' | 'hard';
  setGameState: (state: GameState | null) => void;
  setSelectedCardId: (id: string | null) => void;
  setIsVsAI: (isVsAI: boolean, difficulty?: 'easy' | 'medium' | 'hard') => void;
}

export const useGameStore = create<GameStoreState>((set) => ({
  gameState: null,
  selectedCardId: null,
  isVsAI: true,
  aiDifficulty: 'medium',
  setGameState: (gameState) => set({ gameState }),
  setSelectedCardId: (selectedCardId) => set({ selectedCardId }),
  setIsVsAI: (isVsAI, aiDifficulty = 'medium') => set({ isVsAI, aiDifficulty }),
}));

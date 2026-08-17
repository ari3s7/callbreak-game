import { Card, Suit } from './card.js';

export type GamePhase = 'bidding' | 'playing' | 'round_end' | 'game_over';
export type AIDifficulty = 'easy' | 'medium' | 'hard';

export interface Player {
  id: string;
  name: string;
  isAI: boolean;
  aiDifficulty?: AIDifficulty;
  avatar: string;
  seat: number; // 0..3
  cards: Card[];
  call: number | null;
  tricksWon: number;
  totalScore: number;
  roundScores: number[];
  isOnline: boolean;
}

export interface TrickCard {
  playerId: string;
  card: Card;
}

export interface Trick {
  trickNumber: number; // 1..13
  leadSuit: Suit | null;
  cards: TrickCard[];
  winnerId: string | null;
}

export interface RoundResult {
  roundNumber: number;
  scores: Record<string, { call: number; won: number; score: number }>;
}

export interface GameState {
  id: string;
  phase: GamePhase;
  currentRound: number; // 1..5
  maxRounds: number; // 5
  currentTurnSeat: number; // 0..3
  dealerSeat: number; // 0..3
  players: Player[];
  currentTrick: Trick;
  trickHistory: Trick[];
  roundResults: RoundResult[];
  winnerId: string | null;
}

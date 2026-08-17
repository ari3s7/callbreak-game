export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  createdAt: string;
}

export interface UserStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  totalScore: number;
  bestScore: number;
}

export interface GameHistoryItem {
  id: string;
  playedAt: string;
  players: string[];
  finalRank: number;
  score: number;
  isWin: boolean;
}

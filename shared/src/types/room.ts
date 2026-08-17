import { AIDifficulty } from './game.js';

export interface RoomPlayer {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isReady: boolean;
  isAI: boolean;
  aiDifficulty?: AIDifficulty;
}

export interface Room {
  id: string;
  code: string;
  hostId: string;
  players: RoomPlayer[];
  maxPlayers: number; // 4
  status: 'waiting' | 'playing' | 'finished';
  createdAt: number;
}

import { GameState } from './game.js';
import { Room } from './room.js';

export interface ServerToClientEvents {
  'room:updated': (room: Room) => void;
  'game:state': (state: GameState) => void;
  'game:error': (message: string) => void;
  'game:trick_won': (payload: { winnerId: string; winnerName: string; trickNumber: number }) => void;
  'game:round_ended': (payload: { roundNumber: number; scores: Record<string, { call: number; won: number; score: number }> }) => void;
  'game:over': (payload: { winnerId: string; winnerName: string; finalScores: Record<string, number> }) => void;
}

export interface ClientToServerEvents {
  'room:create': (payload: { isPrivate?: boolean }, callback?: (response: { success: boolean; room?: Room; error?: string }) => void) => void;
  'room:join': (payload: { roomCode: string }, callback?: (response: { success: boolean; room?: Room; error?: string }) => void) => void;
  'room:ready': (ready: boolean) => void;
  'game:start_vs_bots': (payload: { difficulty: 'easy' | 'medium' | 'hard' }, callback?: (response: { success: boolean; state?: GameState; error?: string }) => void) => void;
  'game:call': (callValue: number) => void;
  'game:play_card': (cardId: string) => void;
  'room:leave': () => void;
}

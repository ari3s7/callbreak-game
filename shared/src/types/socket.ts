import { GameState } from './game.js';
import { Room } from './room.js';
import { VoiceSignalPayload, VoiceStatePayload } from './voice.js';

export interface ServerToClientEvents {
  'room:updated': (room: Room) => void;
  'game:state': (state: GameState) => void;
  'game:error': (message: string) => void;
  'game:trick_won': (payload: { winnerId: string; winnerName: string; trickNumber: number }) => void;
  'game:round_ended': (payload: { roundNumber: number; scores: Record<string, { call: number; won: number; score: number }> }) => void;
  'game:over': (payload: { winnerId: string; winnerName: string; finalScores: Record<string, number> }) => void;
  'voice:signal': (payload: VoiceSignalPayload) => void;
  'voice:state_changed': (payload: VoiceStatePayload) => void;
  'voice:user_joined': (payload: { userId: string; userName: string; socketId: string }) => void;
  'voice:user_left': (payload: { userId: string; socketId?: string }) => void;
  'voice:player_mute_changed': (payload: { playerId: string; isMuted: boolean }) => void;
}

export interface ClientToServerEvents {
  'room:create': (payload: { isPrivate?: boolean }, callback?: (response: { success: boolean; room?: Room; error?: string }) => void) => void;
  'room:join': (payload: { roomCode: string }, callback?: (response: { success: boolean; room?: Room; error?: string }) => void) => void;
  'room:ready': (ready: boolean) => void;
  'game:start_vs_bots': (payload: { difficulty: 'easy' | 'medium' | 'hard' }, callback?: (response: { success: boolean; state?: GameState; error?: string }) => void) => void;
  'game:call': (callValue: number) => void;
  'game:play_card': (cardId: string) => void;
  'game:next_round': (payload?: { roomCode?: string }) => void;
  'room:leave': () => void;
  'voice:join': (payload: { roomCode: string; playerId: string; playerName: string }, callback?: (response: { participants: import('./voice.js').VoiceParticipant[] }) => void) => void;
  'voice:leave': (payload: { roomCode: string; playerId: string }) => void;
  'voice:signal': (payload: VoiceSignalPayload) => void;
  'voice:mute_status': (payload: { roomCode: string; playerId: string; isMuted: boolean }) => void;
}

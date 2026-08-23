export interface VoiceSignalPayload {
  targetSocketId?: string;
  targetId?: string;
  senderSocketId?: string;
  senderUserId?: string;
  senderId?: string;
  signal: {
    type: 'offer' | 'answer' | 'candidate';
    sdp?: RTCSessionDescriptionInit;
    candidate?: RTCIceCandidateInit;
  };
}

export interface VoiceParticipant {
  userId: string;
  userName: string;
  socketId: string;
  isMuted: boolean;
}

export interface VoiceStatePayload {
  roomCode: string;
  participants: VoiceParticipant[];
}

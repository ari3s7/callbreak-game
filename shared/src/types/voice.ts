export interface VoiceSignalPayload {
  targetId: string;
  senderId: string;
  signal: {
    type: 'offer' | 'answer' | 'candidate';
    sdp?: RTCSessionDescriptionInit;
    candidate?: RTCIceCandidateInit;
  };
}

export interface VoiceParticipant {
  id: string;
  name: string;
  isMuted: boolean;
}

export interface VoiceStatePayload {
  roomCode: string;
  participants: VoiceParticipant[];
}

import { useEffect, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { voiceChatService } from '../services/voiceChatService.js';

export function useVoiceChat(socket: Socket | null, roomCode: string | null, userId: string, userName: string) {
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [speakingUserIds, setSpeakingUserIds] = useState<Set<string>>(new Set());
  const [mutedPeerIds, setMutedPeerIds] = useState<Set<string>>(new Set());
  const [mutedPlayerIds, setMutedPlayerIds] = useState<Set<string>>(new Set());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (socket) {
      voiceChatService.init(socket);
    }
  }, [socket]);

  useEffect(() => {
    const unsubSpeaking = voiceChatService.onSpeakingChange((speakingSet) => {
      setSpeakingUserIds(new Set(speakingSet));
    });

    const unsubMute = voiceChatService.onMuteChange((playerId, isMuted) => {
      setMutedPlayerIds((prev) => {
        const next = new Set(prev);
        if (isMuted) next.add(playerId);
        else next.delete(playerId);
        return next;
      });
    });

    const unsubError = voiceChatService.onError((msg) => {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(null), 4000);
    });

    return () => {
      unsubSpeaking();
      unsubMute();
      unsubError();
    };
  }, []);

  const toggleVoice = useCallback(async () => {
    if (isJoined) {
      voiceChatService.leaveVoice();
      setIsJoined(false);
      setIsMuted(false);
      setIsDeafened(false);
    } else {
      if (!roomCode || !socket) {
        setErrorMsg('Voice Chat is only available in Multiplayer rooms.');
        setTimeout(() => setErrorMsg(null), 3000);
        return;
      }
      const success = await voiceChatService.joinVoice(roomCode, userId, userName);
      setIsJoined(success);
      if (success) {
        setIsMuted(false);
        setIsDeafened(false);
      }
    }
  }, [isJoined, roomCode, socket, userId, userName]);

  const toggleMute = useCallback(() => {
    const nextMuted = voiceChatService.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  const toggleDeafen = useCallback(() => {
    const nextDeafened = voiceChatService.toggleDeafen();
    setIsDeafened(nextDeafened);
  }, []);

  const togglePeerMute = useCallback((peerUserId: string) => {
    const isPeerMuted = voiceChatService.togglePeerMute(peerUserId);
    setMutedPeerIds((prev) => {
      const next = new Set(prev);
      if (isPeerMuted) next.add(peerUserId);
      else next.delete(peerUserId);
      return next;
    });
  }, []);

  return {
    isJoined,
    isMuted,
    isDeafened,
    speakingUserIds,
    mutedPeerIds,
    mutedPlayerIds,
    errorMsg,
    toggleVoice,
    toggleMute,
    toggleDeafen,
    togglePeerMute,
  };
}

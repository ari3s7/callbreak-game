import { Socket } from 'socket.io-client';
import { VoiceParticipant } from '@callbreak/shared';

export interface VoicePeer {
  userId: string;
  socketId: string;
  pc: RTCPeerConnection;
  audioElement: HTMLAudioElement;
  analyser?: AnalyserNode;
  isMuted: boolean;
}

export type SpeakingCallback = (speakingUserIds: Set<string>) => void;
export type MuteStatusCallback = (playerId: string, isMuted: boolean) => void;
export type VoiceErrorCallback = (error: string) => void;

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export class VoiceChatService {
  private localStream: MediaStream | null = null;
  private peers: Map<string, VoicePeer> = new Map(); // key: socketId
  private userIdToSocketId: Map<string, string> = new Map(); // userId -> socketId
  private socket: Socket | null = null;
  private roomCode: string | null = null;
  private currentUserId: string | null = null;

  private isJoined = false;
  private isMuted = false;
  private isDeafened = false;

  private audioContext: AudioContext | null = null;
  private localAnalyser: AnalyserNode | null = null;
  private speakingCheckInterval: number | null = null;
  private speakingUsers: Set<string> = new Set();
  private onSpeakingChangeCallbacks: Set<SpeakingCallback> = new Set();
  private onMuteChangeCallbacks: Set<MuteStatusCallback> = new Set();
  private onErrorCallbacks: Set<VoiceErrorCallback> = new Set();

  public init(socket: Socket) {
    this.socket = socket;
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on('voice:user_joined', async (data: { userId: string; userName: string; socketId: string }) => {
      if (!this.isJoined || !this.localStream || data.socketId === this.socket?.id) return;
      this.userIdToSocketId.set(data.userId, data.socketId);
      await this.createPeerConnection(data.socketId, data.userId, true);
    });

    this.socket.on('voice:user_left', (data: { userId: string; socketId?: string }) => {
      const socketId = data.socketId || this.userIdToSocketId.get(data.userId);
      if (socketId) {
        this.closePeerConnection(socketId);
      }
    });

    this.socket.on('voice:player_mute_changed', (data: { playerId: string; isMuted: boolean }) => {
      this.notifyMuteChange(data.playerId, data.isMuted);
    });

    this.socket.on('voice:signal', async (data: { senderSocketId: string; senderUserId: string; signal: any }) => {
      if (!this.isJoined || !this.localStream) return;
      const { senderSocketId, senderUserId, signal } = data;
      this.userIdToSocketId.set(senderUserId, senderSocketId);

      let peer = this.peers.get(senderSocketId);
      if (!peer) {
        const created = await this.createPeerConnection(senderSocketId, senderUserId, false);
        if (created) peer = created;
      }

      if (!peer) return;

      try {
        if (signal.type === 'offer') {
          await peer.pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
          const answer = await peer.pc.createAnswer();
          await peer.pc.setLocalDescription(answer);
          this.socket?.emit('voice:signal', {
            targetSocketId: senderSocketId,
            senderUserId: this.currentUserId,
            signal: { type: 'answer', sdp: answer },
          });
        } else if (signal.type === 'answer') {
          await peer.pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        } else if (signal.type === 'candidate' && signal.candidate) {
          await peer.pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
        }
      } catch (err: any) {
        console.error('WebRTC signal handling error:', err);
      }
    });
  }

  public async joinVoice(roomCode: string, userId: string, userName: string): Promise<boolean> {
    if (this.isJoined) return true;

    try {
      this.roomCode = roomCode;
      this.currentUserId = userId;

      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });

      this.isJoined = true;
      this.isMuted = false;

      this.setupVolumeAnalyzer();

      // Emit join and fetch existing participants to connect immediately
      this.socket?.emit(
        'voice:join',
        { roomCode, playerId: userId, playerName: userName },
        async (res: { participants?: VoiceParticipant[] }) => {
          if (res && res.participants && Array.isArray(res.participants)) {
            for (const p of res.participants) {
              if (p.socketId && p.userId && p.socketId !== this.socket?.id) {
                this.userIdToSocketId.set(p.userId, p.socketId);
                await this.createPeerConnection(p.socketId, p.userId, true);
                if (p.isMuted) {
                  this.notifyMuteChange(p.userId, true);
                }
              }
            }
          }
        }
      );

      return true;
    } catch (err: any) {
      console.error('Failed to access microphone for Voice Chat:', err);
      const errMsg =
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Microphone permission denied. Please allow microphone access.'
          : 'Could not access audio device.';
      this.notifyError(errMsg);
      this.leaveVoice();
      return false;
    }
  }

  public leaveVoice() {
    if (!this.isJoined && !this.localStream) return;

    if (this.socket && this.roomCode && this.currentUserId) {
      this.socket.emit('voice:leave', {
        roomCode: this.roomCode,
        playerId: this.currentUserId,
      });
    }

    // Close all peers
    this.peers.forEach((peer, socketId) => {
      this.closePeerConnection(socketId);
    });
    this.peers.clear();
    this.userIdToSocketId.clear();

    // Stop local media stream
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    // Stop audio context
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    if (this.speakingCheckInterval) {
      window.clearInterval(this.speakingCheckInterval);
      this.speakingCheckInterval = null;
    }

    this.isJoined = false;
    this.isMuted = false;
    this.isDeafened = false;
    this.speakingUsers.clear();
    this.notifySpeakingChange();
  }

  public toggleMute(): boolean {
    if (!this.localStream) return false;
    this.isMuted = !this.isMuted;
    this.localStream.getAudioTracks().forEach((track) => {
      track.enabled = !this.isMuted;
    });

    if (this.currentUserId) {
      this.notifyMuteChange(this.currentUserId, this.isMuted);
    }

    if (this.socket && this.roomCode && this.currentUserId) {
      this.socket.emit('voice:mute_status', {
        roomCode: this.roomCode,
        playerId: this.currentUserId,
        isMuted: this.isMuted,
      });
    }

    return this.isMuted;
  }

  public toggleDeafen(): boolean {
    this.isDeafened = !this.isDeafened;
    this.peers.forEach((peer) => {
      peer.audioElement.muted = this.isDeafened || peer.isMuted;
    });
    return this.isDeafened;
  }

  public togglePeerMute(userId: string): boolean {
    const socketId = this.userIdToSocketId.get(userId);
    if (!socketId) return false;

    const peer = this.peers.get(socketId);
    if (!peer) return false;

    peer.isMuted = !peer.isMuted;
    peer.audioElement.muted = this.isDeafened || peer.isMuted;
    return peer.isMuted;
  }

  private async createPeerConnection(
    targetSocketId: string,
    targetUserId: string,
    isInitiator: boolean
  ): Promise<VoicePeer | null> {
    try {
      const pc = new RTCPeerConnection(ICE_SERVERS);
      const audioElement = document.createElement('audio');
      audioElement.autoplay = true;
      audioElement.style.display = 'none';
      document.body.appendChild(audioElement);

      const peer: VoicePeer = {
        userId: targetUserId,
        socketId: targetSocketId,
        pc,
        audioElement,
        isMuted: false,
      };

      this.peers.set(targetSocketId, peer);

      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          pc.addTrack(track, this.localStream!);
        });
      }

      pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          const remoteStream = event.streams[0];
          audioElement.srcObject = remoteStream;
          audioElement.muted = this.isDeafened || peer.isMuted;
          audioElement.play().catch((err) => {
            console.log('Audio play catch:', err);
          });

          // Connect remote stream to AudioContext for remote speaker volume analysis
          if (this.audioContext && !peer.analyser) {
            try {
              const remoteSource = this.audioContext.createMediaStreamSource(remoteStream);
              const remoteAnalyser = this.audioContext.createAnalyser();
              remoteAnalyser.fftSize = 512;
              remoteSource.connect(remoteAnalyser);
              peer.analyser = remoteAnalyser;
            } catch (err) {
              console.error('Remote audio analyzer creation error:', err);
            }
          }
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket?.emit('voice:signal', {
            targetSocketId,
            senderUserId: this.currentUserId,
            signal: { type: 'candidate', candidate: event.candidate },
          });
        }
      };

      if (isInitiator) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        this.socket?.emit('voice:signal', {
          targetSocketId,
          senderUserId: this.currentUserId,
          signal: { type: 'offer', sdp: offer },
        });
      }

      return peer;
    } catch (err: any) {
      console.error('Error creating RTCPeerConnection:', err);
      return null;
    }
  }

  private closePeerConnection(socketId: string) {
    const peer = this.peers.get(socketId);
    if (peer) {
      peer.pc.close();
      peer.audioElement.srcObject = null;
      peer.audioElement.remove();
      this.peers.delete(socketId);
    }
  }

  private setupVolumeAnalyzer() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx || !this.localStream) return;

      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(this.localStream);
      this.localAnalyser = this.audioContext.createAnalyser();
      this.localAnalyser.fftSize = 512;
      source.connect(this.localAnalyser);

      const bufferLength = 256;
      const localDataArray = new Uint8Array(bufferLength);

      this.speakingCheckInterval = window.setInterval(() => {
        if (!this.isJoined) return;

        const nextSpeakingUsers = new Set<string>();

        // Check local mic volume if not muted
        if (!this.isMuted && this.localAnalyser && this.currentUserId) {
          this.localAnalyser.getByteFrequencyData(localDataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += localDataArray[i];
          }
          const average = sum / bufferLength;
          if (average > 18) {
            nextSpeakingUsers.add(this.currentUserId);
          }
        }

        // Check remote peer streams
        const remoteDataArray = new Uint8Array(bufferLength);
        this.peers.forEach((peer) => {
          if (peer.analyser) {
            peer.analyser.getByteFrequencyData(remoteDataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
              sum += remoteDataArray[i];
            }
            const average = sum / bufferLength;
            if (average > 18) {
              nextSpeakingUsers.add(peer.userId);
            }
          }
        });

        // Notify if speaking set changed
        let changed = nextSpeakingUsers.size !== this.speakingUsers.size;
        if (!changed) {
          for (const uid of nextSpeakingUsers) {
            if (!this.speakingUsers.has(uid)) {
              changed = true;
              break;
            }
          }
        }

        if (changed) {
          this.speakingUsers = nextSpeakingUsers;
          this.notifySpeakingChange();
        }
      }, 100);
    } catch (err) {
      console.error('Audio analyzer setup error:', err);
    }
  }

  public onSpeakingChange(callback: SpeakingCallback) {
    this.onSpeakingChangeCallbacks.add(callback);
    return () => this.onSpeakingChangeCallbacks.delete(callback);
  }

  public onMuteChange(callback: MuteStatusCallback) {
    this.onMuteChangeCallbacks.add(callback);
    return () => this.onMuteChangeCallbacks.delete(callback);
  }

  public onError(callback: VoiceErrorCallback) {
    this.onErrorCallbacks.add(callback);
    return () => this.onErrorCallbacks.delete(callback);
  }

  private notifySpeakingChange() {
    const copy = new Set(this.speakingUsers);
    this.onSpeakingChangeCallbacks.forEach((cb) => cb(copy));
  }

  private notifyMuteChange(playerId: string, isMuted: boolean) {
    this.onMuteChangeCallbacks.forEach((cb) => cb(playerId, isMuted));
  }

  private notifyError(msg: string) {
    this.onErrorCallbacks.forEach((cb) => cb(msg));
  }

  public getJoined() {
    return this.isJoined;
  }
  public getMuted() {
    return this.isMuted;
  }
  public getDeafened() {
    return this.isDeafened;
  }
  public getSpeakingUsers() {
    return this.speakingUsers;
  }
}

export const voiceChatService = new VoiceChatService();


import { Server, Socket } from 'socket.io';
import { roomManager } from '../services/roomManager.js';
import { verifyToken } from '../utils/auth.js';

export function setupGameSocket(io: Server) {
  // Listen for internal roomManager state updates (e.g. AI turns, trick completion)
  roomManager.onStateChange((roomCode, state) => {
    io.to(roomCode).emit('game:state', state);
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.cookie?.split('token=')[1]?.split(';')[0];
    if (token) {
      const user = verifyToken(token);
      if (user) {
        socket.data.user = user;
      }
    }
    next();
  });

  io.on('connection', (socket: Socket) => {
    const handshakeAuth = socket.handshake.auth || {};
    const user = socket.data.user || {
      userId: handshakeAuth.userId || `guest-${socket.id.substring(0, 6)}`,
      username: handshakeAuth.username || `GUEST_${socket.id.substring(0, 4).toUpperCase()}`,
    };

    console.log(`Socket connected: ${socket.id} (${user.username}) [${user.userId}]`);

    let currentRoomCode: string | null = null;

    socket.on('room:create', (payload: { player?: any }, callback) => {
      try {
        const pId = payload?.player?.id || user.userId;
        const pName = payload?.player?.name || user.username;
        const room = roomManager.createRoom({
          id: pId,
          name: pName,
          avatar: payload?.player?.avatar || 'avatar-1',
        });
        currentRoomCode = room.code;
        socket.join(room.code);
        if (callback) callback({ success: true, room });
        io.to(room.code).emit('room:updated', room);
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    });

    socket.on('room:join', (payload: { roomCode: string; player?: any }, callback) => {
      try {
        const pId = payload?.player?.id || user.userId;
        const pName = payload?.player?.name || user.username;
        const room = roomManager.joinRoom(payload.roomCode.toUpperCase(), {
          id: pId,
          name: pName,
          avatar: payload?.player?.avatar || 'avatar-1',
        });
        currentRoomCode = room.code;
        socket.join(room.code);
        if (callback) callback({ success: true, room });
        io.to(room.code).emit('room:updated', room);
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    });

    socket.on('room:toggle_ready', (payload: { roomCode?: string; playerId?: string }, callback) => {
      try {
        const code = payload?.roomCode || currentRoomCode;
        const pId = payload?.playerId || user.userId;
        if (!code) return;
        const room = roomManager.toggleReady(code, pId);
        if (room) {
          io.to(room.code).emit('room:updated', room);
          if (callback) callback({ success: true, room });
        }
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    });

    socket.on('room:start', (payload: { roomCode?: string; rounds?: number }, callback) => {
      try {
        const code = payload?.roomCode || currentRoomCode;
        if (!code) throw new Error('No active room to start');
        const game = roomManager.startRoomGame(code, payload?.rounds || 1);
        io.to(code).emit('game:state', game);
        if (callback) callback({ success: true, game });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    });

    socket.on('game:call', (payload: any) => {
      try {
        const callVal = typeof payload === 'number' ? payload : payload?.callValue;
        const pId = payload?.playerId || user.userId;
        const code = payload?.roomCode || currentRoomCode;
        if (!code) return;

        const updatedGame = roomManager.submitCall(code, pId, callVal);
        io.to(code).emit('game:state', updatedGame);
      } catch (err: any) {
        socket.emit('game:error', err.message);
      }
    });

    socket.on('game:play_card', (payload: any) => {
      try {
        const cardId = typeof payload === 'string' ? payload : payload?.cardId;
        const pId = payload?.playerId || user.userId;
        const code = payload?.roomCode || currentRoomCode;
        if (!code) return;

        const updatedGame = roomManager.playCard(code, pId, cardId);
        io.to(code).emit('game:state', updatedGame);
      } catch (err: any) {
        socket.emit('game:error', err.message);
      }
    });

    // Real-Time WebRTC Voice Chat Signaling
    socket.on('voice:join', (payload: { roomCode: string; playerId: string; playerName: string }) => {
      const code = payload?.roomCode || currentRoomCode;
      if (!code) return;
      socket.to(code).emit('voice:user_joined', {
        userId: payload.playerId || user.userId,
        userName: payload.playerName || user.username,
        socketId: socket.id,
      });
    });

    socket.on('voice:leave', (payload: { roomCode: string; playerId: string }) => {
      const code = payload?.roomCode || currentRoomCode;
      if (!code) return;
      socket.to(code).emit('voice:user_left', {
        userId: payload.playerId || user.userId,
        socketId: socket.id,
      });
    });

    socket.on('voice:signal', (payload: any) => {
      const targetSocket = payload?.targetSocketId || payload?.targetId;
      if (targetSocket) {
        io.to(targetSocket).emit('voice:signal', {
          senderSocketId: socket.id,
          senderUserId: payload.senderUserId || user.userId,
          signal: payload.signal,
        });
      }
    });

    socket.on('voice:mute_status', (payload: { roomCode: string; playerId: string; isMuted: boolean }) => {
      const code = payload?.roomCode || currentRoomCode;
      if (!code) return;
      socket.to(code).emit('voice:state_changed', {
        roomCode: code,
        participants: [],
      });
    });

    socket.on('disconnect', () => {
      if (currentRoomCode) {
        socket.to(currentRoomCode).emit('voice:user_left', {
          userId: user.userId,
          socketId: socket.id,
        });
      }
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}

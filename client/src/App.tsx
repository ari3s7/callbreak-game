import React, { useEffect, useState } from 'react';
import { GameState, Room, getValidMoves, selectAICard, calculateAICall } from '@callbreak/shared';
import { io, Socket } from 'socket.io-client';
import { AuthPage } from './pages/AuthPage.js';
import { Navbar } from './components/layout/Navbar.js';
import { GamePage } from './pages/GamePage.js';
import { HomePage } from './pages/HomePage.js';
import { LeaderboardPage } from './pages/LeaderboardPage.js';
import { LobbyPage } from './pages/LobbyPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { clientGameManager } from './services/clientGameManager.js';
import { soundFx } from './audio/soundSystem.js';
import { useAuthStore } from './stores/authStore.js';
import { useGameStore } from './stores/gameStore.js';
import { apiUrl, getSocketUrl } from './config/apiConfig.js';

type ViewMode = 'auth' | 'home' | 'game' | 'profile' | 'leaderboard' | 'lobby';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('auth');
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [turnSecondsLeft, setTurnSecondsLeft] = useState(20);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const { user, setUser, logout } = useAuthStore();
  const { gameState, setGameState } = useGameStore();

  const humanUserId = user?.id || '';
  const humanUserName = user?.username || '';
  const currentTurnName = gameState?.players[gameState.currentTurnSeat]?.name || '';

  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const res = await fetch(apiUrl('/api/auth/me'), { credentials: 'include' });
        if (!res.ok) {
          if (!user) {
            setUser(null, null);
            setCurrentView('auth');
          }
          return;
        }

        const data = await res.json();
        if (data.user) {
          setUser(data.user, null);
          setCurrentView('home');
        } else if (!user) {
          setUser(null, null);
          setCurrentView('auth');
        }
      } catch {
        if (!user) {
          setUser(null, null);
          setCurrentView('auth');
        }
      } finally {
        setAuthLoading(false);
      }
    };

    hydrateSession();
  }, [setUser]);

  // Setup Socket with user details
  useEffect(() => {
    if (!user) {
      setSocket(null);
      return;
    }

    const serverUrl = getSocketUrl();
    const nextSocket = io(serverUrl, {
      withCredentials: true,
      autoConnect: true,
      auth: {
        userId: user.id,
        username: user.username,
      },
    });

    nextSocket.on('room:updated', (room: Room) => {
      setActiveRoom(room);
    });

    nextSocket.on('game:state', (state: GameState) => {
      setGameState(state);
      setCurrentView('game');
    });

    nextSocket.on('game:error', (message: string) => {
      alert(message);
    });

    setSocket(nextSocket);

    return () => {
      nextSocket.disconnect();
      setSocket(null);
    };
  }, [user, setGameState]);

  const [recordedGameId, setRecordedGameId] = useState<string | null>(null);

  // Turn management and AI progression loop for single-player vs AI
  useEffect(() => {
    if (!gameState) return;

    // In multiplayer mode, the server controls AI progression and authoritative state
    if (activeRoom) {
      setTurnSecondsLeft(20);
      const countdownTimer = window.setInterval(() => {
        setTurnSecondsLeft((secondsLeft) => Math.max(secondsLeft - 1, 0));
      }, 1000);
      return () => window.clearInterval(countdownTimer);
    }

    if (gameState.phase === 'game_over') {
      setTurnSecondsLeft(20);

      // Persist single player game to database once
      if (gameState.id !== recordedGameId) {
        setRecordedGameId(gameState.id);
        const sortedPlayers = [...gameState.players].sort((a, b) => b.totalScore - a.totalScore);
        const payload = {
          winnerId: gameState.winnerId,
          players: sortedPlayers.map((p, idx) => ({
            id: p.id,
            name: p.name,
            totalScore: p.totalScore,
            rank: idx + 1,
            isAI: p.isAI,
          })),
        };

        fetch(apiUrl('/api/users/record-game'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        }).catch((err) => console.error('Failed to record match:', err));
      }

      return;
    }

    // Handle Trick completion pause in single player
    if (
      gameState.phase === 'playing' &&
      gameState.currentTrick.cards.length === 4 &&
      gameState.currentTrick.winnerId
    ) {
      setTurnSecondsLeft(20);
      soundFx.playTrickWin();

      const trickTimer = window.setTimeout(() => {
        const updated = clientGameManager.resolveCompletedTrick(gameState);
        if (updated) {
          setGameState({ ...updated });
        }
      }, 1800);

      return () => window.clearTimeout(trickTimer);
    }

    if (gameState.phase === 'round_end') {
      setTurnSecondsLeft(20);
      return;
    }

    const currentPlayer = gameState.players[gameState.currentTurnSeat];
    if (!currentPlayer) return;

    setTurnSecondsLeft(20);

    const countdownTimer = window.setInterval(() => {
      setTurnSecondsLeft((secondsLeft) => Math.max(secondsLeft - 1, 0));
    }, 1000);

    const turnDuration = currentPlayer.isAI ? 1100 : 20000;

    const turnTimer = window.setTimeout(() => {
      if (currentPlayer.isAI) {
        const updated = clientGameManager.processNextAITurn(gameState);
        if (updated) {
          if (gameState.phase === 'playing') {
            soundFx.playCardPlay();
          }
          setGameState({ ...updated });
        }
        return;
      }

      // Timeout fallback for human player (Strict 20-second timeout)
      if (gameState.phase === 'bidding') {
        const bestCall = calculateAICall(currentPlayer.cards, 'medium');
        const updated = clientGameManager.submitCall(gameState, currentPlayer.id, bestCall);
        setGameState({ ...updated });
        return;
      }

      if (gameState.phase === 'playing') {
        // Auto-play the best possible legal card: follows lead pattern, spades priority, or lowest duck
        const bestCard = selectAICard(
          currentPlayer.cards,
          gameState.currentTrick.leadSuit,
          gameState.currentTrick.cards,
          currentPlayer.call || 1,
          currentPlayer.tricksWon,
          'medium',
          currentPlayer.id
        );
        soundFx.playCardPlay();
        const updated = clientGameManager.playCard(gameState, currentPlayer.id, bestCard.id);
        setGameState({ ...updated });
      }
    }, turnDuration);

    return () => {
      window.clearInterval(countdownTimer);
      window.clearTimeout(turnTimer);
    };
  }, [gameState, setGameState, activeRoom]);

  // Single-player VS AI Initialization
  const handleStartVsAI = (difficulty: 'easy' | 'medium' | 'hard', rounds: number = 1) => {
    if (!user) return;

    setActiveRoom(null);
    const newGame = clientGameManager.createSinglePlayerGame(
      { id: humanUserId, name: humanUserName, avatar: user.avatar || 'avatar-1' },
      difficulty,
      rounds
    );
    setGameState(newGame);
    setCurrentView('game');
  };

  // Submit Bidding Call (Supports both Local Single Player and Real-time Multiplayer)
  const handleSubmitCall = (callValue: number) => {
    if (!gameState) return;
    if (activeRoom && socket) {
      socket.emit('game:call', { roomCode: activeRoom.code, playerId: humanUserId, callValue });
    } else {
      const updated = clientGameManager.submitCall(gameState, humanUserId, callValue);
      setGameState({ ...updated });
    }
  };

  // Play Card (Supports both Local Single Player and Real-time Multiplayer)
  const handlePlayCard = (cardId: string) => {
    if (!gameState) return;
    soundFx.playCardPlay();
    if (activeRoom && socket) {
      socket.emit('game:play_card', { roomCode: activeRoom.code, playerId: humanUserId, cardId });
    } else {
      const updated = clientGameManager.playCard(gameState, humanUserId, cardId);
      setGameState({ ...updated });
    }
  };

  // Next Round
  const handleNextRound = () => {
    if (!gameState) return;
    if (activeRoom && socket) {
      socket.emit('room:start', { roomCode: activeRoom.code, rounds: gameState.maxRounds });
    } else {
      const nextGame = clientGameManager.startNextRound(gameState);
      setGameState({ ...nextGame });
    }
  };

  // Play Again
  const handlePlayAgain = () => {
    if (activeRoom && socket) {
      socket.emit('room:start', { roomCode: activeRoom.code, rounds: gameState?.maxRounds || 1 });
    } else {
      handleStartVsAI('medium', 1);
    }
  };

  // Create Room
  const handleCreateRoom = () => {
    if (!user || !socket) return;

    socket.emit(
      'room:create',
      { player: { id: humanUserId, name: humanUserName, avatar: user.avatar || 'avatar-1' } },
      (response: { success: boolean; room?: Room; error?: string }) => {
        if (!response.success || !response.room) {
          alert(response.error || 'Could not create room');
          return;
        }

        setActiveRoom(response.room);
        setCurrentView('lobby');
      }
    );
  };

  // Join Room
  const handleJoinRoom = (code: string) => {
    if (!user || !socket) return;

    socket.emit(
      'room:join',
      { roomCode: code, player: { id: humanUserId, name: humanUserName, avatar: user.avatar || 'avatar-1' } },
      (response: { success: boolean; room?: Room; error?: string }) => {
        if (!response.success || !response.room) {
          alert(response.error || 'Could not join room');
          return;
        }

        setActiveRoom(response.room);
        setCurrentView('lobby');
      }
    );
  };

  // Toggle Ready in Lobby
  const handleLobbyReady = () => {
    if (!activeRoom || !socket) return;
    socket.emit(
      'room:toggle_ready',
      { roomCode: activeRoom.code, playerId: humanUserId },
      (response: { success: boolean; room?: Room }) => {
        if (response?.room) {
          setActiveRoom(response.room);
        }
      }
    );
  };

  // Host Launch Room Game
  const handleStartLobbyGame = (rounds: number = 1) => {
    if (!activeRoom || !socket) return;
    socket.emit('room:start', { roomCode: activeRoom.code, rounds }, (response: { success: boolean; game?: GameState; error?: string }) => {
      if (response?.game) {
        setGameState(response.game);
        setCurrentView('game');
      } else if (response?.error) {
        alert(response.error);
      }
    });
  };

  const handleAuthenticated = () => {
    setCurrentView('home');
  };

  const handleLogout = () => {
    logout();
    setActiveRoom(null);
    setGameState(null);
    setCurrentView('auth');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0B0E13] text-[#F1F5F9] flex items-center justify-center font-mono">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full border border-[#00D5FF]/40 flex items-center justify-center text-[#00D5FF] animate-pulse">
            ♠
          </div>
          <div className="text-xs tracking-[0.25em] text-[#00D5FF] uppercase">Loading session</div>
        </div>
      </div>
    );
  }

  if (currentView === 'auth' || !user) {
    return <AuthPage onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-[#0B0E13] text-[#F1F5F9] font-sans flex flex-col justify-between">
      <Navbar
        onNavigateHome={() => setCurrentView('home')}
        onNavigateProfile={() => setCurrentView('profile')}
        onNavigateLeaderboard={() => setCurrentView('leaderboard')}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onStartVsAI={handleStartVsAI}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
          />
        )}

        {currentView === 'game' && gameState && (
          <GamePage
            gameState={gameState}
            humanPlayerId={humanUserId}
            currentTurnName={currentTurnName}
            turnSecondsLeft={turnSecondsLeft}
            onSubmitCall={handleSubmitCall}
            onPlayCard={handlePlayCard}
            onNextRound={handleNextRound}
            onPlayAgain={handlePlayAgain}
            onReturnHome={() => setCurrentView('home')}
          />
        )}

        {currentView === 'profile' && <ProfilePage />}

        {currentView === 'leaderboard' && <LeaderboardPage />}

        {currentView === 'lobby' && activeRoom && (
          <LobbyPage
            room={activeRoom}
            currentUserId={humanUserId}
            onReady={handleLobbyReady}
            onStartGame={handleStartLobbyGame}
          />
        )}
      </main>
    </div>
  );
};

import { Request, RequestHandler, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { prisma } from '../services/db.js';

export async function getProfile(req: AuthRequest, res: Response) {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const gamePlayers = await prisma.gamePlayer.findMany({
      where: { userId },
      include: { game: true },
    });

    const gamesPlayed = gamePlayers.length;
    const wins = gamePlayers.filter((gp) => gp.rank === 1).length;
    const losses = gamesPlayed - wins;
    const winRate = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;
    const scores = gamePlayers.map((gp) => gp.finalScore);
    const totalScore = scores.reduce((a, b) => a + b, 0);
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

    return res.json({
      user: {
        id: user?.id || userId,
        username: user?.username || req.user?.username,
        email: user?.email || '',
        avatar: user?.avatar || 'avatar-1',
      },
      stats: {
        gamesPlayed,
        wins,
        losses,
        winRate,
        totalScore: Math.round(totalScore * 10) / 10,
        bestScore: Math.round(bestScore * 10) / 10,
      },
    });
  } catch (err: any) {
    return res.json({
      user: {
        id: userId,
        username: req.user?.username || 'PLAYER',
        email: `${req.user?.username || 'player'}@callbreak.io`,
        avatar: 'avatar-1',
      },
      stats: {
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        totalScore: 0,
        bestScore: 0,
      },
    });
  }
}

export async function getHistory(req: AuthRequest, res: Response) {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const gamePlayers = await prisma.gamePlayer.findMany({
      where: { userId },
      include: {
        game: {
          include: {
            gamePlayers: true,
          },
        },
      },
      orderBy: { id: 'desc' },
      take: 20,
    });

    const history = gamePlayers.map((gp) => ({
      id: gp.gameId,
      playedAt: gp.game.createdAt.toISOString(),
      players: gp.game.gamePlayers.map((p) => p.playerName),
      finalRank: gp.rank,
      score: gp.finalScore,
      isWin: gp.rank === 1,
    }));

    return res.json({ history });
  } catch (err: any) {
    return res.json({ history: [] });
  }
}

export async function recordGame(req: AuthRequest, res: Response) {
  const userId = req.user?.userId;
  const { players, winnerId } = req.body;

  if (!players || !Array.isArray(players) || players.length === 0) {
    return res.status(400).json({ error: 'Invalid game players data' });
  }

  try {
    const game = await prisma.game.create({
      data: {
        status: 'completed',
        completedAt: new Date(),
        winnerId,
        gamePlayers: {
          create: players.map((p: any) => ({
            userId: p.isAI ? null : (p.id === userId ? userId : (p.userId || null)),
            playerName: p.name,
            seat: p.seat || 0,
            finalScore: Math.round((p.totalScore || p.score || 0) * 10) / 10,
            rank: p.rank || 1,
            isAI: !!p.isAI,
          })),
        },
      },
      include: {
        gamePlayers: true,
      },
    });

    return res.json({ success: true, gameId: game.id });
  } catch (err: any) {
    console.error('Error recording game result:', err);
    return res.status(500).json({ error: 'Failed to record game' });
  }
}

export const getLeaderboard: RequestHandler = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        gamePlayers: true,
      },
    });

    const userStats = users.map((u) => {
      const games = u.gamePlayers;
      const gamesPlayed = games.length;
      const wins = games.filter((g) => g.rank === 1).length;
      const winRate = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;
      const scores = games.map((g) => g.finalScore);
      const totalScore = Math.round(scores.reduce((a, b) => a + b, 0) * 10) / 10;

      return {
        id: u.id,
        username: u.username,
        avatar: u.avatar,
        gamesPlayed,
        wins,
        winRate,
        totalScore,
      };
    });

    // Sort real users by wins desc, totalScore desc
    userStats.sort((a, b) => b.wins - a.wins || b.totalScore - a.totalScore);

    const leaderboard = userStats.map((stat, idx) => ({
      rank: idx + 1,
      ...stat,
    }));

    return res.json({ leaderboard });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

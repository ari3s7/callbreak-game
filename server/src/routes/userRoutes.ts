import { Router } from 'express';
import { getHistory, getLeaderboard, getProfile, recordGame } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/profile', authenticateToken, getProfile);
router.get('/history', authenticateToken, getHistory);
router.post('/record-game', authenticateToken, recordGame);
router.get('/leaderboard', getLeaderboard);

export default router;

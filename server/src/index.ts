import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { connectDB } from './services/db.js';
import { setupGameSocket } from './socket/gameSocket.js';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? undefined : '../.env' });

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://callbreak-game-uzq8.onrender.com',
  'https://callbreak-game.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean) as string[];

const corsOriginHandler = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean | string) => void
) => {
  // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
  if (!origin) {
    return callback(null, true);
  }

  // Check if origin is explicitly in allowed list or is a valid Render / localhost / LAN origin
  if (
    allowedOrigins.includes(origin) ||
    origin.endsWith('.onrender.com') ||
    origin.includes('localhost') ||
    origin.includes('127.0.0.1') ||
    (process.env.NODE_ENV !== 'production' &&
      (origin.startsWith('http://192.168.') ||
        origin.startsWith('http://10.') ||
        origin.startsWith('http://172.')))
  ) {
    return callback(null, origin);
  }

  return callback(new Error(`CORS origin not allowed: ${origin}`));
};

const io = new Server(httpServer, {
  cors: {
    origin: corsOriginHandler,
    credentials: true,
  },
});

app.use(
  cors({
    origin: corsOriginHandler,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Setup Socket.IO
setupGameSocket(io);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Call Break server listening on port ${PORT}`);
  });
});

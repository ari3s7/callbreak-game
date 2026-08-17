# ♠ CALL BREAK | Modern Digital Card Game

A production-quality, modern full-stack **Call Break card game** built with TypeScript, React, Vite, Node.js, Express, Socket.IO, Tailwind CSS, and Prisma ORM.

---

## 🌟 Key Features

- **Pure TypeScript Game Engine**: Decoupled engine in `@callbreak/shared` handling deck creation, Fisher-Yates shuffling, dealing, Call Break trick-taking rules (follow suit, mandatory spade trump cut), trick winner determination, and standard scoring (`call + (won-call)*0.1` vs `-call`).
- **Authentic Traditional Playing Cards**: Bicycle-inspired card designs featuring white `#F8FAFC` card faces, traditional red/black suit styling, an iconic detailed Ace of Spades, mirrored vector SVG artwork for Jack, Queen, and King, custom 2–10 pip layouts, and a dark navy/cyan technical card back.
- **Modern Dark Technical UI**: Styled with `#0B0E13` background, `#11151C` surfaces, thin 1px `#222C38` tech borders, cyan accents (`#00B8E6`, `#00D5FF`), red accents (`#FF3B4E`), and Space Grotesk typography. **No gold, wood, or casino green.**
- **AI Opponents**: Easy, Medium, and Hard AI algorithms capable of realistic hand bidding, trick tracking, saving high trumps, and strategic card play.
- **Real-Time Multiplayer Architecture**: Socket.IO integration for room creation, code joining, player readiness, state synchronization, and reconnection logic.
- **Full Player Profile & Leaderboard**: Track games played, wins, win rate, best score, recent game history, and global user rankings.
- **Procedural Sound FX**: Web Audio API sound synthesizer for card clicks, card deals, and trick victory chimes with built-in mute toggle.

---

## 🏗 Architecture & Workspace Layout

```text
call-break/
├── shared/           # Decoupled Game Engine & TypeScript Types
│   ├── src/game/     # deck.ts, rules.ts, scoring.ts, ai.ts
│   └── src/types/    # card.ts, game.ts, room.ts, socket.ts, user.ts
├── server/           # Node.js + Express + Socket.IO Backend
│   ├── src/controllers/ # Auth, User Profile, Leaderboard
│   ├── src/services/    # Room & Game State Manager, DB
│   └── prisma/          # Database schema (User, Game, GameRound)
├── client/           # React + Vite + Tailwind CSS Frontend
│   ├── src/components/card/  # PlayingCard, FaceCardSVG, PipLayout, CardBack
│   ├── src/components/game/  # GameTable, PlayerSeat, CallSelector, TrickArea, HUDBar
│   ├── src/pages/            # HomePage, GamePage, ProfilePage, LeaderboardPage, LobbyPage
│   └── src/audio/            # Web Audio API Sound FX
└── docker-compose.yml
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### 2. Installation
```bash
npm install
```

### 3. Running Unit Tests
```bash
npm run test
```

### 4. Running Development Servers
```bash
npm run dev
```
- Client runs at: `http://localhost:5173`
- Backend API server runs at: `http://localhost:5000`

---

## 📜 Call Break Rules Summary

1. **Deck**: Standard 52-card deck. Spades (♠) are permanent trumps.
2. **Deal**: 13 cards dealt to each of the 4 players.
3. **Bidding**: Each player calls between 1 and 13 expected tricks.
4. **Trick-Taking**:
   - First player plays any card.
   - Subsequent players MUST follow the leading suit if held.
   - If unable to follow suit, player MUST play a Spade (trump) if held.
   - If unable to follow suit and holding no Spades, any card can be played.
5. **Trick Winner**: Highest Spade played wins the trick; if no Spade played, highest card of the leading suit wins.
6. **Scoring**:
   - If `tricksWon >= call`: `score = call + (tricksWon - call) * 0.1`
   - If `tricksWon < call`: `score = -call`

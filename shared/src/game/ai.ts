import { Card, Suit } from '../types/card.js';
import { AIDifficulty, TrickCard } from '../types/game.js';
import { determineTrickWinner, getValidMoves } from './rules.js';

export function calculateAICall(hand: Card[], difficulty: AIDifficulty = 'medium'): number {
  if (difficulty === 'easy') {
    // Easy AI: Call between 1 and 4 semi-randomly
    const highCardCount = hand.filter((c) => c.value >= 12).length;
    return Math.min(8, Math.max(1, highCardCount + Math.floor(Math.random() * 2)));
  }

  // Medium and Hard AI: Evaluate hand strength
  const spades = hand.filter((c) => c.suit === 'spades');
  const highSpades = spades.filter((c) => c.value >= 11).length; // J, Q, K, A
  const otherAces = hand.filter((c) => c.suit !== 'spades' && c.rank === 'A').length;
  const otherKings = hand.filter((c) => c.suit !== 'spades' && c.rank === 'K').length;

  let estimatedTricks = highSpades + otherAces;

  if (spades.length >= 4) {
    estimatedTricks += spades.length - 3; // Long spade suit bonus
  }

  if (difficulty === 'hard') {
    if (otherKings > 0) estimatedTricks += Math.round(otherKings * 0.7);
    const suitCounts: Record<string, number> = {};
    for (const card of hand) {
      suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
    }
    // Short suit bonus for void/singleton to trump
    for (const [suit, count] of Object.entries(suitCounts)) {
      if (suit !== 'spades' && count <= 1 && spades.length > 0) {
        estimatedTricks += 0.5;
      }
    }
  }

  return Math.min(8, Math.max(1, Math.round(estimatedTricks)));
}

export function selectAICard(
  hand: Card[],
  leadSuit: Suit | null,
  playedInTrick: TrickCard[],
  call: number,
  tricksWon: number,
  difficulty: AIDifficulty = 'medium',
  botPlayerId: string = 'bot'
): Card {
  const validMoves = getValidMoves(hand, leadSuit, playedInTrick);

  if (validMoves.length === 0) {
    throw new Error('No valid moves available for AI');
  }

  if (validMoves.length === 1) {
    return validMoves[0];
  }

  if (difficulty === 'easy') {
    // Easy AI: Pick a random valid card
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
  }

  const needsTricks = tricksWon < call;

  // Medium / Hard AI strategy
  if (!leadSuit || playedInTrick.length === 0) {
    // AI is leading the trick
    if (needsTricks) {
      // Lead with highest non-spade card or highest Spade
      const nonSpades = validMoves.filter((c) => c.suit !== 'spades');
      if (nonSpades.length > 0) {
        // Sort descending by rank
        nonSpades.sort((a, b) => b.value - a.value);
        return nonSpades[0];
      }
      validMoves.sort((a, b) => b.value - a.value);
      return validMoves[0]; // Highest spade
    } else {
      // Lead with lowest non-spade to duck
      const nonSpades = validMoves.filter((c) => c.suit !== 'spades');
      if (nonSpades.length > 0) {
        nonSpades.sort((a, b) => a.value - b.value);
        return nonSpades[0];
      }
      validMoves.sort((a, b) => a.value - b.value);
      return validMoves[0]; // Lowest card
    }
  }

  // AI is following or trumping
  // Check which moves can win the current trick
  const winningMoves: Card[] = [];
  for (const card of validMoves) {
    const testTrick: TrickCard[] = [
      ...playedInTrick,
      { playerId: botPlayerId, card },
    ];
    const winnerId = determineTrickWinner(testTrick, leadSuit);
    if (winnerId === botPlayerId) {
      winningMoves.push(card);
    }
  }

  if (needsTricks && winningMoves.length > 0) {
    // Play the LOWEST winning card to save high cards
    winningMoves.sort((a, b) => a.value - b.value);
    return winningMoves[0];
  }

  // If cannot win or doesn't need tricks, play the LOWEST valid card to duck
  validMoves.sort((a, b) => a.value - b.value);
  return validMoves[0];
}

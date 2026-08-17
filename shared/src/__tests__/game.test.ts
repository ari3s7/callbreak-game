import { describe, expect, it } from 'vitest';
import { Card, Suit } from '../types/card.js';
import { calculateAICall, selectAICard } from '../game/ai.js';
import { createDeck, dealCards, shuffleDeck, sortHand } from '../game/deck.js';
import { determineTrickWinner, getValidMoves, isValidMove } from '../game/rules.js';
import { calculatePlayerScore, calculateRoundScores, calculateTotalScores } from '../game/scoring.js';

describe('Call Break Game Engine', () => {
  describe('Deck Operations', () => {
    it('creates a standard 52-card deck with 4 suits and 13 ranks each', () => {
      const deck = createDeck();
      expect(deck).toHaveLength(52);

      const spades = deck.filter((c) => c.suit === 'spades');
      const hearts = deck.filter((c) => c.suit === 'hearts');
      const diamonds = deck.filter((c) => c.suit === 'diamonds');
      const clubs = deck.filter((c) => c.suit === 'clubs');

      expect(spades).toHaveLength(13);
      expect(hearts).toHaveLength(13);
      expect(diamonds).toHaveLength(13);
      expect(clubs).toHaveLength(13);
    });

    it('shuffles deck preserving card count and unique cards', () => {
      const deck = createDeck();
      const shuffled = shuffleDeck(deck);
      expect(shuffled).toHaveLength(52);
      const uniqueIds = new Set(shuffled.map((c) => c.id));
      expect(uniqueIds.size).toBe(52);
    });

    it('deals 13 sorted cards to 4 players', () => {
      const deck = shuffleDeck(createDeck());
      const hands = dealCards(deck);

      expect(hands).toHaveLength(4);
      hands.forEach((hand) => {
        expect(hand).toHaveLength(13);
      });
    });

    it('sorts hand by suit order (Spades, Hearts, Diamonds, Clubs) and rank descending', () => {
      const hand: Card[] = [
        { id: 'clubs-2', suit: 'clubs', rank: '2', value: 2 },
        { id: 'spades-10', suit: 'spades', rank: '10', value: 10 },
        { id: 'hearts-A', suit: 'hearts', rank: 'A', value: 14 },
        { id: 'spades-A', suit: 'spades', rank: 'A', value: 14 },
      ];

      const sorted = sortHand(hand);
      expect(sorted[0].id).toBe('spades-A');
      expect(sorted[1].id).toBe('spades-10');
      expect(sorted[2].id).toBe('hearts-A');
      expect(sorted[3].id).toBe('clubs-2');
    });
  });

  describe('Rule Validation', () => {
    const spadeA: Card = { id: 'spades-A', suit: 'spades', rank: 'A', value: 14 };
    const spade10: Card = { id: 'spades-10', suit: 'spades', rank: '10', value: 10 };
    const heartK: Card = { id: 'hearts-K', suit: 'hearts', rank: 'K', value: 13 };
    const heart5: Card = { id: 'hearts-5', suit: 'hearts', rank: '5', value: 5 };
    const diamond7: Card = { id: 'diamonds-7', suit: 'diamonds', rank: '7', value: 7 };

    it('allows any card when leading the trick', () => {
      const hand = [spadeA, heartK, diamond7];
      const valid = getValidMoves(hand, null, []);
      expect(valid).toHaveLength(3);
    });

    it('enforces following suit when player holds lead suit cards', () => {
      const hand = [spadeA, heartK, heart5, diamond7];
      // Lead suit is hearts
      const played = [{ playerId: 'p1', card: { id: 'hearts-8', suit: 'hearts' as Suit, rank: '8' as const, value: 8 } }];
      const valid = getValidMoves(hand, 'hearts', played);

      // Must play hearts
      expect(valid.every((c) => c.suit === 'hearts')).toBe(true);
      expect(valid).toContainEqual(heartK);
    });

    it('enforces playing a spade (trump) when holding no lead suit cards', () => {
      const hand = [spadeA, spade10, diamond7];
      // Lead suit is hearts (player has no hearts)
      const played = [{ playerId: 'p1', card: { id: 'hearts-8', suit: 'hearts' as Suit, rank: '8' as const, value: 8 } }];
      const valid = getValidMoves(hand, 'hearts', played);

      // Must play a spade
      expect(valid.every((c) => c.suit === 'spades')).toBe(true);
    });

    it('allows playing any card if player has no lead suit and no spades', () => {
      const hand = [diamond7];
      const played = [{ playerId: 'p1', card: { id: 'hearts-8', suit: 'hearts' as Suit, rank: '8' as const, value: 8 } }];
      const valid = getValidMoves(hand, 'hearts', played);

      expect(valid).toEqual([diamond7]);
    });
  });

  describe('Trick Winner Determination', () => {
    it('determines winner by highest spade when trump is played', () => {
      const trick = [
        { playerId: 'p1', card: { id: 'hearts-A', suit: 'hearts' as Suit, rank: 'A' as const, value: 14 } },
        { playerId: 'p2', card: { id: 'spades-3', suit: 'spades' as Suit, rank: '3' as const, value: 3 } },
        { playerId: 'p3', card: { id: 'spades-J', suit: 'spades' as Suit, rank: 'J' as const, value: 11 } },
        { playerId: 'p4', card: { id: 'hearts-K', suit: 'hearts' as Suit, rank: 'K' as const, value: 13 } },
      ];

      const winner = determineTrickWinner(trick, 'hearts');
      expect(winner).toBe('p3'); // p3 played Spade J (value 11 vs 3)
    });

    it('determines winner by highest card of lead suit when no spade is played', () => {
      const trick = [
        { playerId: 'p1', card: { id: 'hearts-10', suit: 'hearts' as Suit, rank: '10' as const, value: 10 } },
        { playerId: 'p2', card: { id: 'hearts-A', suit: 'hearts' as Suit, rank: 'A' as const, value: 14 } },
        { playerId: 'p3', card: { id: 'diamonds-K', suit: 'diamonds' as Suit, rank: 'K' as const, value: 13 } },
        { playerId: 'p4', card: { id: 'hearts-7', suit: 'hearts' as Suit, rank: '7' as const, value: 7 } },
      ];

      const winner = determineTrickWinner(trick, 'hearts');
      expect(winner).toBe('p2'); // p2 played Hearts A
    });
  });

  describe('Scoring Formula', () => {
    it('calculates score correctly when tricks won equals call (4 call / 4 won = 4.0)', () => {
      expect(calculatePlayerScore(4, 4)).toBe(4.0);
    });

    it('calculates score correctly when tricks won exceeds call (4 call / 6 won = 4.2)', () => {
      expect(calculatePlayerScore(4, 6)).toBe(4.2);
    });

    it('calculates penalty score when tricks won is less than call (5 call / 3 won = -5.0)', () => {
      expect(calculatePlayerScore(5, 3)).toBe(-5.0);
    });
  });

  describe('AI Logic', () => {
    it('calculates realistic calls for AI hands', () => {
      const strongHand: Card[] = [
        { id: 'spades-A', suit: 'spades', rank: 'A', value: 14 },
        { id: 'spades-K', suit: 'spades', rank: 'K', value: 13 },
        { id: 'spades-Q', suit: 'spades', rank: 'Q', value: 12 },
        { id: 'spades-J', suit: 'spades', rank: 'J', value: 11 },
        { id: 'hearts-A', suit: 'hearts', rank: 'A', value: 14 },
      ];

      const call = calculateAICall(strongHand, 'hard');
      expect(call).toBeGreaterThanOrEqual(4);
    });

    it('selects valid card for AI turn', () => {
      const hand: Card[] = [
        { id: 'spades-A', suit: 'spades', rank: 'A', value: 14 },
        { id: 'hearts-K', suit: 'hearts', rank: 'K', value: 13 },
      ];

      const selected = selectAICard(hand, 'hearts', [], 3, 1, 'medium', 'bot1');
      expect(isValidMove(selected.id, hand, 'hearts', [])).toBe(true);
    });
  });
});

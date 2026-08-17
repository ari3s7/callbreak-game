import { Card, RANK_VALUES, RANKS, SUIT_ORDER, SUITS } from '../types/card.js';

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        value: RANK_VALUES[rank],
      });
    }
  }
  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function sortHand(hand: Card[]): Card[] {
  return [...hand].sort((a, b) => {
    if (a.suit !== b.suit) {
      return SUIT_ORDER[b.suit] - SUIT_ORDER[a.suit];
    }
    return b.value - a.value;
  });
}

export function dealCards(deck: Card[]): Card[][] {
  if (deck.length !== 52) {
    throw new Error('Deck must have exactly 52 cards to deal');
  }

  const hands: Card[][] = [[], [], [], []];
  for (let i = 0; i < 52; i++) {
    hands[i % 4].push(deck[i]);
  }

  return hands.map(sortHand);
}

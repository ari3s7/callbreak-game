export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';

export type Rank =
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K'
  | 'A';

export interface Card {
  id: string; // e.g. "spades-A"
  suit: Suit;
  rank: Rank;
  value: number; // 2..14 (where A=14)
}

export const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
export const RANKS: Rank[] = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
];

export const RANK_VALUES: Record<Rank, number> = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

export const SUIT_ORDER: Record<Suit, number> = {
  spades: 4,
  hearts: 3,
  diamonds: 2,
  clubs: 1,
};

export const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

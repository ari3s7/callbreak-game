import { Card, Suit } from '../types/card.js';
import { TrickCard } from '../types/game.js';

/**
 * Returns array of cards in `hand` that are legal to play given current trick context.
 */
export function getValidMoves(
  hand: Card[],
  leadSuit: Suit | null,
  playedInTrick: TrickCard[]
): Card[] {
  if (hand.length === 0) return [];

  // If leading the trick, any card is valid
  if (!leadSuit || playedInTrick.length === 0) {
    return hand;
  }

  // 1. Check if player has leading suit cards
  const leadSuitCards = hand.filter((c) => c.suit === leadSuit);
  if (leadSuitCards.length > 0) {
    // Player MUST follow suit
    // Optional strict check: Try to play higher card of lead suit if possible
    const currentLeadValues = playedInTrick
      .filter((t) => t.card.suit === leadSuit)
      .map((t) => t.card.value);
    const maxLeadValue =
      currentLeadValues.length > 0 ? Math.max(...currentLeadValues) : 0;

    const higherLeadCards = leadSuitCards.filter((c) => c.value > maxLeadValue);
    if (higherLeadCards.length > 0) {
      return higherLeadCards;
    }
    return leadSuitCards;
  }

  // 2. Player does NOT have leading suit -> MUST play a Spade (trump) if held
  const spadesInHand = hand.filter((c) => c.suit === 'spades');
  if (spadesInHand.length > 0) {
    const currentSpadeValues = playedInTrick
      .filter((t) => t.card.suit === 'spades')
      .map((t) => t.card.value);

    if (currentSpadeValues.length > 0) {
      const maxSpadeValue = Math.max(...currentSpadeValues);
      const higherSpades = spadesInHand.filter((c) => c.value > maxSpadeValue);
      if (higherSpades.length > 0) {
        return higherSpades;
      }
    }
    return spadesInHand;
  }

  // 3. Player has neither leading suit nor Spades -> Any card is valid
  return hand;
}

/**
 * Checks whether a specific card is valid to play.
 */
export function isValidMove(
  cardId: string,
  hand: Card[],
  leadSuit: Suit | null,
  playedInTrick: TrickCard[]
): boolean {
  const validMoves = getValidMoves(hand, leadSuit, playedInTrick);
  return validMoves.some((c) => c.id === cardId);
}

/**
 * Determines which player wins the completed trick of 4 cards.
 */
export function determineTrickWinner(
  playedInTrick: TrickCard[],
  leadSuit: Suit
): string {
  if (playedInTrick.length === 0) {
    throw new Error('Cannot determine winner of empty trick');
  }

  const spadesPlayed = playedInTrick.filter(
    (tc) => tc.card.suit === 'spades'
  );

  if (spadesPlayed.length > 0) {
    // Highest spade wins
    let highest = spadesPlayed[0];
    for (let i = 1; i < spadesPlayed.length; i++) {
      if (spadesPlayed[i].card.value > highest.card.value) {
        highest = spadesPlayed[i];
      }
    }
    return highest.playerId;
  }

  // No spades played -> highest card of leading suit wins
  const leadSuitPlayed = playedInTrick.filter(
    (tc) => tc.card.suit === leadSuit
  );

  if (leadSuitPlayed.length === 0) {
    // Fallback to first card played (should not happen if leadSuit is set correctly)
    return playedInTrick[0].playerId;
  }

  let highest = leadSuitPlayed[0];
  for (let i = 1; i < leadSuitPlayed.length; i++) {
    if (leadSuitPlayed[i].card.value > highest.card.value) {
      highest = leadSuitPlayed[i];
    }
  }
  return highest.playerId;
}

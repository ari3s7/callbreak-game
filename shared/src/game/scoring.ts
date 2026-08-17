export function calculatePlayerScore(call: number, tricksWon: number): number {
  if (call < 1 || call > 13) {
    throw new Error('Call must be between 1 and 13');
  }

  let score: number;
  if (tricksWon >= call) {
    const extraTricks = tricksWon - call;
    score = call + extraTricks * 0.1;
  } else {
    score = -call;
  }

  // Round to 1 decimal place to avoid JS floating point inaccuracies
  return Math.round(score * 10) / 10;
}

export function calculateRoundScores(
  players: { id: string; call: number | null; tricksWon: number }[]
): Record<string, { call: number; won: number; score: number }> {
  const result: Record<string, { call: number; won: number; score: number }> = {};

  for (const p of players) {
    const call = p.call ?? 1;
    const score = calculatePlayerScore(call, p.tricksWon);
    result[p.id] = {
      call,
      won: p.tricksWon,
      score,
    };
  }

  return result;
}

export function calculateTotalScores(
  roundScoresList: Record<string, { call: number; won: number; score: number }>[]
): Record<string, number> {
  const totals: Record<string, number> = {};

  for (const roundScores of roundScoresList) {
    for (const [playerId, data] of Object.entries(roundScores)) {
      totals[playerId] = Math.round(((totals[playerId] || 0) + data.score) * 10) / 10;
    }
  }

  return totals;
}

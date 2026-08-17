import React from 'react';
import { Rank, Suit } from '@callbreak/shared';
import { SuitIcon } from './SuitIcon.js';

interface PipLayoutProps {
  rank: Rank;
  suit: Suit;
}

interface PipPosition {
  x: number; // percentage from left (0 to 100)
  y: number; // percentage from top (0 to 100)
  inverted?: boolean;
}

const PIP_CONFIGS: Record<number, PipPosition[]> = {
  2: [
    { x: 50, y: 22 },
    { x: 50, y: 78, inverted: true },
  ],
  3: [
    { x: 50, y: 22 },
    { x: 50, y: 50 },
    { x: 50, y: 78, inverted: true },
  ],
  4: [
    { x: 28, y: 22 },
    { x: 72, y: 22 },
    { x: 28, y: 78, inverted: true },
    { x: 72, y: 78, inverted: true },
  ],
  5: [
    { x: 28, y: 22 },
    { x: 72, y: 22 },
    { x: 50, y: 50 },
    { x: 28, y: 78, inverted: true },
    { x: 72, y: 78, inverted: true },
  ],
  6: [
    { x: 28, y: 22 },
    { x: 72, y: 22 },
    { x: 28, y: 50 },
    { x: 72, y: 50 },
    { x: 28, y: 78, inverted: true },
    { x: 72, y: 78, inverted: true },
  ],
  7: [
    { x: 28, y: 22 },
    { x: 72, y: 22 },
    { x: 50, y: 36 },
    { x: 28, y: 50 },
    { x: 72, y: 50 },
    { x: 28, y: 78, inverted: true },
    { x: 72, y: 78, inverted: true },
  ],
  8: [
    { x: 28, y: 22 },
    { x: 72, y: 22 },
    { x: 50, y: 36 },
    { x: 28, y: 50 },
    { x: 72, y: 50 },
    { x: 50, y: 64, inverted: true },
    { x: 28, y: 78, inverted: true },
    { x: 72, y: 78, inverted: true },
  ],
  9: [
    { x: 28, y: 19 },
    { x: 72, y: 19 },
    { x: 28, y: 39 },
    { x: 72, y: 39 },
    { x: 50, y: 50 },
    { x: 28, y: 61, inverted: true },
    { x: 72, y: 61, inverted: true },
    { x: 28, y: 81, inverted: true },
    { x: 72, y: 81, inverted: true },
  ],
  10: [
    { x: 28, y: 18 },
    { x: 72, y: 18 },
    { x: 50, y: 29 },
    { x: 28, y: 40 },
    { x: 72, y: 40 },
    { x: 28, y: 60, inverted: true },
    { x: 72, y: 60, inverted: true },
    { x: 50, y: 71, inverted: true },
    { x: 28, y: 82, inverted: true },
    { x: 72, y: 82, inverted: true },
  ],
};

export const PipLayout: React.FC<PipLayoutProps> = ({ rank, suit }) => {
  const num = parseInt(rank, 10);
  const pips = PIP_CONFIGS[num];

  if (!pips) return null;

  return (
    <div className="w-full h-full relative overflow-hidden pointer-events-none select-none">
      {pips.map((pip, idx) => (
        <div
          key={idx}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${pip.inverted ? 'rotate-180' : ''}`}
          style={{ left: `${pip.x}%`, top: `${pip.y}%` }}
        >
          <SuitIcon suit={suit} className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5" />
        </div>
      ))}
    </div>
  );
};

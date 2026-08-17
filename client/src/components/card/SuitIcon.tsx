import React from 'react';
import { Suit } from '@callbreak/shared';

interface SuitIconProps {
  suit: Suit;
  className?: string;
  color?: string;
}

export const SuitIcon: React.FC<SuitIconProps> = ({ suit, className = 'w-4 h-4', color }) => {
  const isRed = suit === 'hearts' || suit === 'diamonds';
  const fillColor = color || (isRed ? '#DC2626' : '#0F172A');

  switch (suit) {
    case 'spades':
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" preserveAspectRatio="xMidYMid meet">
          <path
            d="M50 12 C35 36 18 55 30 72 C38 82 46 76 46 76 C45 83 42 94 34 98 L66 98 C58 94 55 83 54 76 C54 76 62 82 70 72 C82 55 65 36 50 12 Z"
            fill={fillColor}
          />
        </svg>
      );
    case 'hearts':
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" preserveAspectRatio="xMidYMid meet">
          <path
            d="M50 88 C20 62 14 38 24 22 C34 7 46 14 50 24 C54 14 66 7 76 22 C86 38 80 62 50 88 Z"
            fill={fillColor}
          />
        </svg>
      );
    case 'diamonds':
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" preserveAspectRatio="xMidYMid meet">
          <path d="M50 10 L86 50 L50 90 L14 50 Z" fill={fillColor} />
        </svg>
      );
    case 'clubs':
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" preserveAspectRatio="xMidYMid meet">
          {/* Top circle */}
          <circle cx="50" cy="30" r="18" fill={fillColor} />
          {/* Left circle */}
          <circle cx="34" cy="58" r="18" fill={fillColor} />
          {/* Right circle */}
          <circle cx="66" cy="58" r="18" fill={fillColor} />
          {/* Center fill to merge */}
          <circle cx="50" cy="50" r="14" fill={fillColor} />
          {/* Base stalk */}
          <path d="M46 54 C46 68 40 88 32 96 L68 96 C60 88 54 68 54 54 Z" fill={fillColor} />
        </svg>
      );
    default:
      return null;
  }
};

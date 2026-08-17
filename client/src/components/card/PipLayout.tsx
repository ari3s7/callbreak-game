import React from 'react';
import { Rank, Suit, SUIT_SYMBOLS } from '@callbreak/shared';

interface PipLayoutProps {
  rank: Rank;
  suit: Suit;
}

export const PipLayout: React.FC<PipLayoutProps> = ({ rank, suit }) => {
  const symbol = SUIT_SYMBOLS[suit];
  const isRed = suit === 'hearts' || suit === 'diamonds';
  const colorClass = isRed ? 'text-[#FF3B4E]' : 'text-[#111827]';

  const num = parseInt(rank, 10);
  if (isNaN(num)) return null;

  const renderPips = () => {
    switch (num) {
      case 2:
        return (
          <div className="flex flex-col justify-between items-center h-full py-1">
            <span className="text-base sm:text-lg leading-none">{symbol}</span>
            <span className="text-base sm:text-lg leading-none transform rotate-180">{symbol}</span>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col justify-between items-center h-full py-0.5">
            <span className="text-sm sm:text-base leading-none">{symbol}</span>
            <span className="text-sm sm:text-base leading-none">{symbol}</span>
            <span className="text-sm sm:text-base leading-none transform rotate-180">{symbol}</span>
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-2 justify-between items-between h-full py-0.5 px-1">
            <span className="text-sm leading-none">{symbol}</span>
            <span className="text-sm leading-none text-right">{symbol}</span>
            <span className="text-sm leading-none transform rotate-180">{symbol}</span>
            <span className="text-sm leading-none transform rotate-180 text-right">{symbol}</span>
          </div>
        );
      case 5:
        return (
          <div className="relative w-full h-full py-0.5 px-1 flex flex-col justify-between">
            <div className="flex justify-between">
              <span className="text-xs sm:text-sm leading-none">{symbol}</span>
              <span className="text-xs sm:text-sm leading-none">{symbol}</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs sm:text-sm leading-none">{symbol}</span>
            </div>
            <div className="flex justify-between transform rotate-180">
              <span className="text-xs sm:text-sm leading-none">{symbol}</span>
              <span className="text-xs sm:text-sm leading-none">{symbol}</span>
            </div>
          </div>
        );
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      default:
        return (
          <div className="grid grid-cols-2 gap-0.5 items-center justify-items-center h-full py-1 px-1 overflow-hidden">
            {Array.from({ length: Math.min(num, 8) }).map((_, i) => (
              <span
                key={i}
                className={`text-[9px] sm:text-[10px] leading-none ${
                  i >= Math.floor(num / 2) ? 'transform rotate-180' : ''
                }`}
              >
                {symbol}
              </span>
            ))}
          </div>
        );
    }
  };

  return <div className={`w-full h-full overflow-hidden ${colorClass}`}>{renderPips()}</div>;
};

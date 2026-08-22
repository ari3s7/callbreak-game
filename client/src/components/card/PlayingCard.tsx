import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@callbreak/shared';
import { soundFx } from '../../audio/soundSystem.js';
import { CardBack } from './CardBack.js';
import { FaceCardSVG } from './FaceCardSVG.js';
import { PipLayout } from './PipLayout.js';
import { SuitIcon } from './SuitIcon.js';

interface PlayingCardProps {
  card?: Card;
  faceDown?: boolean;
  isSelected?: boolean;
  isPlayable?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PlayingCard: React.FC<PlayingCardProps> = ({
  card,
  faceDown = false,
  isSelected = false,
  isPlayable = true,
  onClick,
  className = '',
  size = 'md',
}) => {
  const sizeClasses =
    size === 'sm'
      ? 'w-[44px] xs:w-[50px] sm:w-[60px] md:w-[68px] aspect-[2.5/3.5] text-[9px] xs:text-[10px] sm:text-xs'
      : size === 'lg'
      ? 'w-[84px] sm:w-[98px] md:w-[112px] aspect-[2.5/3.5] text-sm sm:text-base'
      : 'w-[clamp(46px,11.5vw,70px)] sm:w-[72px] md:w-[82px] lg:w-[88px] aspect-[2.5/3.5] text-[10px] xs:text-xs sm:text-sm';

  if (faceDown || !card) {
    return (
      <div className={`${sizeClasses} ${className} flex-shrink-0 rounded-md sm:rounded-lg overflow-hidden border border-[#222C38]/60 shadow-md`}>
        <CardBack />
      </div>
    );
  }

  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
  const textColor = isRed ? 'text-[#DC2626]' : 'text-[#0F172A]';

  const handleClick = () => {
    if (isPlayable && onClick) {
      soundFx.playCardClick();
      onClick();
    }
  };

  const isAceOfSpades = card.suit === 'spades' && card.rank === 'A';
  const isFaceCard = card.rank === 'J' || card.rank === 'Q' || card.rank === 'K';
  const isAce = card.rank === 'A';

  return (
    <motion.div
      whileHover={isPlayable ? { y: -8, scale: 1.04, zIndex: 40 } : {}}
      whileTap={isPlayable ? { scale: 0.96 } : {}}
      onClick={handleClick}
      style={{
        touchAction: 'manipulation',
        transformStyle: 'preserve-3d',
        WebkitFontSmoothing: 'antialiased',
      }}
      className={`
        relative select-none rounded-md sm:rounded-lg bg-white border transition-all duration-150 flex flex-col justify-between p-0.5 xs:p-1 flex-shrink-0 overflow-hidden
        ${
          isPlayable
            ? 'border-[#00D5FF] ring-1.5 ring-[#00D5FF]/80 shadow-[0_0_0_1px_rgba(0,213,255,0.75),0_0_8px_rgba(0,213,255,0.2)] cursor-pointer'
            : 'border-[#CBD5E1] shadow-sm sm:shadow-md cursor-default'
        }
        ${
          isSelected
            ? '!border-[#00D5FF] !ring-2 !ring-[#00D5FF] shadow-[0_0_0_1px_rgba(0,213,255,0.9),0_0_14px_rgba(0,213,255,0.35)] -translate-y-3 sm:-translate-y-4 z-40'
            : ''
        }
        ${sizeClasses}
        ${className}
      `}
    >
      {/* Top Left Rank & Suit Corner Marker */}
      <div className={`absolute top-0.5 left-0.5 xs:top-1 xs:left-1 z-10 flex flex-col items-center leading-none font-bold font-display pointer-events-none select-none ${textColor}`}>
        <span className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm tracking-tight">{card.rank}</span>
        <SuitIcon suit={card.suit} className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 mt-0.5" />
      </div>

      {/* Center Card Content Area */}
      <div className="absolute inset-x-2 inset-y-2 xs:inset-x-2.5 xs:inset-y-3 sm:inset-x-3.5 sm:inset-y-4 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        {isAceOfSpades ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <svg className="w-[58%] aspect-[100/120]" viewBox="0 0 100 120" fill="none" preserveAspectRatio="xMidYMid meet" shapeRendering="geometricPrecision">
              {/* Ornate Ace of Spades */}
              <path
                d="M50 8 C32 36 12 60 26 80 C36 92 46 84 46 84 C45 92 41 106 32 112 L68 112 C59 106 55 92 54 84 C54 84 64 92 74 80 C88 60 68 36 50 8 Z"
                fill="#0F172A"
              />
              <circle cx="50" cy="56" r="10" fill="#00D5FF" opacity="0.9" />
              <path d="M50 48 L54 60 L46 60 Z" fill="#FFFFFF" />
            </svg>
          </div>
        ) : isFaceCard ? (
          <FaceCardSVG rank={card.rank} suit={card.suit} />
        ) : isAce ? (
          <SuitIcon suit={card.suit} className="w-[45%] aspect-square" />
        ) : (
          <PipLayout rank={card.rank} suit={card.suit} />
        )}
      </div>

      {/* Bottom Right Inverted Rank & Suit Corner Marker */}
      <div className={`absolute bottom-0.5 right-0.5 xs:bottom-1 xs:right-1 z-10 flex flex-col items-center leading-none font-bold font-display transform rotate-180 pointer-events-none select-none ${textColor}`}>
        <span className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm tracking-tight">{card.rank}</span>
        <SuitIcon suit={card.suit} className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 mt-0.5" />
      </div>
    </motion.div>
  );
};

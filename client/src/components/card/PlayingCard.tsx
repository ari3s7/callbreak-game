import React from 'react';
import { motion } from 'framer-motion';
import { Card, SUIT_SYMBOLS } from '@callbreak/shared';
import { soundFx } from '../../audio/soundSystem.js';
import { CardBack } from './CardBack.js';
import { FaceCardSVG } from './FaceCardSVG.js';
import { PipLayout } from './PipLayout.js';

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
      ? 'w-[44px] xs:w-[50px] sm:w-[60px] md:w-[68px] aspect-[2.5/3.5] text-[10px] xs:text-[11px] sm:text-xs'
      : size === 'lg'
      ? 'w-[84px] sm:w-[98px] md:w-[112px] aspect-[2.5/3.5] text-sm sm:text-base'
      : 'w-[clamp(46px,11.5vw,70px)] sm:w-[72px] md:w-[82px] lg:w-[88px] aspect-[2.5/3.5] text-[10px] xs:text-xs sm:text-sm';

  if (faceDown || !card) {
    return (
      <div className={`${sizeClasses} ${className} flex-shrink-0 rounded sm:rounded-lg overflow-hidden border border-[#222C38]/50 shadow-md`}>
        <CardBack />
      </div>
    );
  }

  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
  const textColor = isRed ? 'text-[#FF3B4E]' : 'text-[#111827]';
  const symbol = SUIT_SYMBOLS[card.suit];

  const handleClick = () => {
    if (isPlayable && onClick) {
      soundFx.playCardClick();
      onClick();
    }
  };

  const isAceOfSpades = card.suit === 'spades' && card.rank === 'A';
  const isFaceCard = card.rank === 'J' || card.rank === 'Q' || card.rank === 'K';

  return (
    <motion.div
      whileHover={isPlayable ? { y: -8, scale: 1.04, zIndex: 40 } : {}}
      whileTap={isPlayable ? { scale: 0.96 } : {}}
      onClick={handleClick}
      style={{ touchAction: 'manipulation' }}
      className={`
        relative select-none rounded sm:rounded-lg bg-[#F8FAFC] border border-[#222C38]/40 shadow-md sm:shadow-lg transition-all duration-150 flex flex-col justify-between p-0.5 sm:p-1 flex-shrink-0 overflow-hidden
        ${isSelected ? 'border-[#00D5FF] ring-2 ring-[#00D5FF] shadow-cyan-glow -translate-y-3 sm:-translate-y-4 z-40' : ''}
        ${!isPlayable ? 'opacity-40 grayscale-[20%] cursor-not-allowed' : 'cursor-pointer'}
        ${sizeClasses}
        ${className}
      `}
    >
      {/* Top Left Rank & Suit Corner Marker */}
      <div className={`absolute top-0.5 left-0.5 sm:left-1 z-10 flex flex-col items-center leading-none font-bold font-display pointer-events-none select-none ${textColor}`}>
        <span className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm tracking-tighter">{card.rank}</span>
        <span className="text-[7px] xs:text-[8px] sm:text-[10px] md:text-xs leading-none">{symbol}</span>
      </div>

      {/* Center Card Content */}
      <div className="absolute inset-x-1.5 inset-y-2 sm:inset-x-2 sm:inset-y-3 flex items-center justify-center pointer-events-none overflow-hidden">
        {isAceOfSpades ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <svg className="w-4 h-5 xs:w-5 xs:h-6 sm:w-7 sm:h-9 md:w-9 md:h-11" viewBox="0 0 100 120" fill="none" preserveAspectRatio="xMidYMid meet">
              <path
                d="M50 10 C30 40 10 65 30 85 C42 97 50 85 50 85 C50 85 58 97 70 85 C90 65 70 40 50 10 Z"
                fill="#111827"
              />
              <path d="M45 80 L55 80 L60 105 L40 105 Z" fill="#111827" />
              <circle cx="50" cy="55" r="7" fill="#00B8E6" opacity="0.9" />
              <path d="M50 48 L53 58 L47 58 Z" fill="#F8FAFC" />
            </svg>
          </div>
        ) : isFaceCard ? (
          <FaceCardSVG rank={card.rank} suit={card.suit} />
        ) : card.rank === 'A' ? (
          <span className={`text-base xs:text-lg sm:text-2xl md:text-3xl ${textColor}`}>{symbol}</span>
        ) : (
          <PipLayout rank={card.rank} suit={card.suit} />
        )}
      </div>

      {/* Bottom Right Inverted Rank & Suit Corner Marker */}
      <div className={`absolute bottom-0.5 right-0.5 sm:right-1 z-10 flex flex-col items-center leading-none font-bold font-display transform rotate-180 pointer-events-none select-none ${textColor}`}>
        <span className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm tracking-tighter">{card.rank}</span>
        <span className="text-[7px] xs:text-[8px] sm:text-[10px] md:text-xs leading-none">{symbol}</span>
      </div>
    </motion.div>
  );
};

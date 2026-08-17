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
      ? 'w-[52px] h-[74px] text-[11px]'
      : size === 'lg'
      ? 'w-[96px] h-[138px] text-base'
      : 'w-[72px] h-[104px] sm:w-[84px] sm:h-[120px] text-xs sm:text-sm';

  if (faceDown || !card) {
    return (
      <div className={`${sizeClasses} ${className} flex-shrink-0`}>
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
      whileHover={isPlayable ? { y: -16, scale: 1.06, zIndex: 40 } : {}}
      whileTap={isPlayable ? { scale: 0.96 } : {}}
      onClick={handleClick}
      className={`
        relative select-none rounded-lg bg-[#F8FAFC] border border-[#222C38]/40 shadow-lg transition-all duration-150 flex flex-col justify-between p-1 flex-shrink-0
        ${isSelected ? 'border-[#00D5FF] ring-2 ring-[#00D5FF] shadow-cyan-glow -translate-y-4 z-40' : ''}
        ${!isPlayable ? 'opacity-40 grayscale-[20%] cursor-not-allowed' : 'cursor-pointer'}
        ${sizeClasses}
        ${className}
      `}
    >
      {/* Top Left Rank & Suit Corner Marker */}
      <div className={`absolute top-0.5 left-1 z-10 flex flex-col items-center leading-none font-bold font-display ${textColor}`}>
        <span className="text-xs sm:text-sm tracking-tighter">{card.rank}</span>
        <span className="text-[10px] sm:text-xs leading-none">{symbol}</span>
      </div>

      {/* Center Card Content */}
      <div className="absolute inset-x-2.5 inset-y-3.5 flex items-center justify-center pointer-events-none">
        {isAceOfSpades ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <svg className="w-8 h-10 sm:w-10 sm:h-12" viewBox="0 0 100 120" fill="none">
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
          <span className={`text-2xl sm:text-3xl ${textColor}`}>{symbol}</span>
        ) : (
          <PipLayout rank={card.rank} suit={card.suit} />
        )}
      </div>

      {/* Bottom Right Inverted Rank & Suit Corner Marker */}
      <div className={`absolute bottom-0.5 right-1 z-10 flex flex-col items-center leading-none font-bold font-display transform rotate-180 ${textColor}`}>
        <span className="text-xs sm:text-sm tracking-tighter">{card.rank}</span>
        <span className="text-[10px] sm:text-xs leading-none">{symbol}</span>
      </div>
    </motion.div>
  );
};

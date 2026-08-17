import React from 'react';
import { Rank, Suit } from '@callbreak/shared';
import { SuitIcon } from './SuitIcon.js';

interface FaceCardProps {
  rank: Rank;
  suit: Suit;
}

export const FaceCardSVG: React.FC<FaceCardProps> = ({ rank, suit }) => {
  const isRed = suit === 'hearts' || suit === 'diamonds';
  const primaryColor = isRed ? '#DC2626' : '#1E293B';
  const secondaryColor = isRed ? '#F87171' : '#475569';
  const goldColor = '#D97706';
  const skinColor = '#FDE68A';

  const renderFigure = () => {
    if (rank === 'K') {
      return (
        <svg viewBox="0 0 100 80" className="w-full h-full" fill="none" preserveAspectRatio="xMidYMid meet">
          {/* Royal Cape */}
          <path d="M15 80 L22 42 L78 42 L85 80 Z" fill={primaryColor} />
          <path d="M26 42 L38 80 L62 80 L74 42 Z" fill="#FEF3C7" stroke={primaryColor} strokeWidth="1.5" />
          
          {/* Ermine dots on collar */}
          <circle cx="34" cy="55" r="1.5" fill="#0F172A" />
          <circle cx="44" cy="68" r="1.5" fill="#0F172A" />
          <circle cx="56" cy="68" r="1.5" fill="#0F172A" />
          <circle cx="66" cy="55" r="1.5" fill="#0F172A" />

          {/* Scepter / Sword */}
          <line x1="82" y1="30" x2="82" y2="78" stroke={goldColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M78 30 L86 30 L82 22 Z" fill={goldColor} />

          {/* Face & Beard */}
          <path d="M34 32 Q50 26 66 32 L66 52 Q50 64 34 52 Z" fill={skinColor} stroke={primaryColor} strokeWidth="1.5" />
          {/* Beard & Mustache */}
          <path d="M36 44 Q50 50 64 44 Q50 62 36 44 Z" fill="#CBD5E1" stroke={primaryColor} strokeWidth="1" />
          <path d="M42 42 Q50 48 58 42" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
          {/* Eyes & Nose */}
          <circle cx="43" cy="36" r="1.5" fill="#0F172A" />
          <circle cx="57" cy="36" r="1.5" fill="#0F172A" />
          <path d="M50 34 L48 40 L52 40" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Crown */}
          <path d="M30 26 L36 12 L50 20 L64 12 L70 26 Z" fill={goldColor} stroke={primaryColor} strokeWidth="1.5" />
          <circle cx="36" cy="11" r="2" fill={secondaryColor} />
          <circle cx="50" cy="19" r="2" fill={primaryColor} />
          <circle cx="64" cy="11" r="2" fill={secondaryColor} />
          <rect x="32" y="23" width="36" height="4" fill={primaryColor} />
        </svg>
      );
    }

    if (rank === 'Q') {
      return (
        <svg viewBox="0 0 100 80" className="w-full h-full" fill="none" preserveAspectRatio="xMidYMid meet">
          {/* Queen Gown & Veil */}
          <path d="M18 80 L25 38 Q50 28 75 38 L82 80 Z" fill={secondaryColor} />
          <path d="M30 45 L40 80 L60 80 L70 45 Z" fill="#FFFBEB" stroke={primaryColor} strokeWidth="1.5" />

          {/* Scepter with Rose */}
          <line x1="80" y1="36" x2="80" y2="78" stroke={goldColor} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="80" cy="32" r="4.5" fill={primaryColor} />
          <circle cx="80" cy="32" r="2" fill={goldColor} />

          {/* Face & Hair */}
          <path d="M32 38 Q25 55 35 60 Q50 66 65 60 Q75 55 68 38 Z" fill="#FDE68A" />
          <path d="M36 34 Q50 28 64 34 L64 52 Q50 60 36 52 Z" fill={skinColor} stroke={primaryColor} strokeWidth="1.5" />
          {/* Eyes, Nose & Lips */}
          <circle cx="43" cy="38" r="1.5" fill="#0F172A" />
          <circle cx="57" cy="38" r="1.5" fill="#0F172A" />
          <path d="M50 36 L48 42 L52 42" stroke={primaryColor} strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M45 48 Q50 52 55 48" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />

          {/* Tiara / Crown */}
          <path d="M33 26 L40 14 L50 22 L60 14 L67 26 Z" fill={goldColor} stroke={primaryColor} strokeWidth="1.5" />
          <circle cx="50" cy="14" r="2.5" fill={primaryColor} />
          <circle cx="40" cy="13" r="1.5" fill={secondaryColor} />
          <circle cx="60" cy="13" r="1.5" fill={secondaryColor} />
          {/* Necklace */}
          <path d="M42 56 Q50 62 58 56" stroke={goldColor} strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      );
    }

    // Jack
    return (
      <svg viewBox="0 0 100 80" className="w-full h-full" fill="none" preserveAspectRatio="xMidYMid meet">
        {/* Armor & Cape */}
        <path d="M16 80 L24 40 L76 40 L84 80 Z" fill={primaryColor} />
        <path d="M30 46 L38 80 L62 80 L70 46 Z" fill="#E2E8F0" stroke={primaryColor} strokeWidth="1.5" />
        
        {/* Halberd / Staff */}
        <line x1="82" y1="24" x2="82" y2="78" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M78 24 L86 24 L86 16 L82 10 L78 16 Z" fill={goldColor} stroke={primaryColor} strokeWidth="1" />

        {/* Face */}
        <path d="M34 32 Q50 26 66 32 L66 52 Q50 60 34 52 Z" fill={skinColor} stroke={primaryColor} strokeWidth="1.5" />
        {/* Eyes, Nose & Mouth */}
        <circle cx="43" cy="37" r="1.5" fill="#0F172A" />
        <circle cx="57" cy="37" r="1.5" fill="#0F172A" />
        <path d="M50 35 L48 41 L52 41" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M44 47 Q50 51 56 47" stroke={primaryColor} strokeWidth="1.8" strokeLinecap="round" />

        {/* Knight Beret with Plume Feather */}
        <path d="M30 28 Q50 16 70 28 L66 34 L34 34 Z" fill={secondaryColor} stroke={primaryColor} strokeWidth="1.5" />
        <path d="M64 24 Q82 6 74 2 Q66 8 62 24" fill={goldColor} stroke={primaryColor} strokeWidth="1" />
        <circle cx="63" cy="24" r="2.5" fill={primaryColor} />
      </svg>
    );
  };

  return (
    <div className="w-full h-full border border-[#94A3B8]/30 rounded relative bg-[#F8FAFC] flex flex-col justify-between overflow-hidden p-0.5 select-none pointer-events-none">
      {/* Top Half */}
      <div className="w-full h-1/2 relative overflow-hidden flex items-center justify-center">
        {renderFigure()}
        {/* Inset Mini Suit */}
        <div className="absolute top-1 right-1 opacity-90">
          <SuitIcon suit={suit} className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        </div>
      </div>

      {/* Traditional Center Dividing Ribbon */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#94A3B8]/50 to-transparent my-0.5 relative flex items-center justify-center">
        <div className="bg-[#F8FAFC] px-1 py-0.2 border border-[#94A3B8]/40 rounded text-[7px] font-bold font-display text-[#64748B] leading-none">
          {rank}
        </div>
      </div>

      {/* Bottom Half (Rotated 180° for traditional double-ended symmetry) */}
      <div className="w-full h-1/2 relative overflow-hidden flex items-center justify-center transform rotate-180">
        {renderFigure()}
        <div className="absolute top-1 right-1 opacity-90">
          <SuitIcon suit={suit} className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        </div>
      </div>
    </div>
  );
};

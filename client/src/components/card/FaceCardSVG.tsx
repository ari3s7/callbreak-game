import React from 'react';
import { Rank, Suit } from '@callbreak/shared';

interface FaceCardProps {
  rank: Rank;
  suit: Suit;
}

export const FaceCardSVG: React.FC<FaceCardProps> = ({ rank, suit }) => {
  const isRed = suit === 'hearts' || suit === 'diamonds';
  const mainColor = isRed ? '#FF3B4E' : '#111827';
  const accentColor = '#00B8E6';
  const coatColor = isRed ? '#FF6B7A' : '#374151';

  return (
    <div className="w-full h-full border border-[#222C38]/20 rounded relative bg-white/50 flex flex-col justify-between overflow-hidden p-0.5">
      {/* Top Half */}
      <div className="w-full h-1/2 flex items-center justify-center relative">
        <svg className="w-full h-full" viewBox="0 0 100 110" fill="none" preserveAspectRatio="xMidYMid meet">
          {rank === 'K' && (
            <g>
              {/* King Crown */}
              <path d="M20 35 L35 15 L50 28 L65 15 L80 35 L70 45 L30 45 Z" fill={mainColor} stroke="#111827" strokeWidth="2" />
              <circle cx="35" cy="12" r="3" fill={accentColor} />
              <circle cx="50" cy="22" r="3.5" fill={accentColor} />
              <circle cx="65" cy="12" r="3" fill={accentColor} />
              {/* Hair & Face */}
              <path d="M30 42 Q50 32 70 42 L70 75 Q50 85 30 75 Z" fill="#F8FAFC" stroke={mainColor} strokeWidth="2" />
              {/* Eyes & Mustache */}
              <circle cx="40" cy="50" r="1.5" fill="#111827" />
              <circle cx="60" cy="50" r="1.5" fill="#111827" />
              <path d="M38 60 Q50 68 62 60" stroke={mainColor} strokeWidth="3" fill="none" />
              <path d="M42 66 Q50 74 58 66" stroke={mainColor} strokeWidth="2" fill="none" />
              {/* Sword/Scepter */}
              <line x1="15" y1="20" x2="15" y2="85" stroke={accentColor} strokeWidth="3" />
              <path d="M10 20 L20 20 L15 10 Z" fill={mainColor} />
              {/* Robe Collar */}
              <path d="M20 75 Q50 95 80 75 L80 110 L20 110 Z" fill={coatColor} opacity="0.9" />
            </g>
          )}

          {rank === 'Q' && (
            <g>
              {/* Queen Crown */}
              <path d="M25 35 L38 18 L50 30 L62 18 L75 35 L68 45 L32 45 Z" fill={mainColor} stroke="#111827" strokeWidth="2" />
              <circle cx="50" cy="14" r="4" fill={accentColor} />
              {/* Queen Veil & Hair */}
              <path d="M25 40 Q50 28 75 40 Q80 70 70 82 Q50 92 30 82 Z" fill="#F8FAFC" stroke={mainColor} strokeWidth="2" />
              {/* Eyes & Mouth */}
              <circle cx="42" cy="52" r="1.5" fill="#111827" />
              <circle cx="58" cy="52" r="1.5" fill="#111827" />
              <path d="M44 65 Q50 70 56 65" stroke={mainColor} strokeWidth="2.5" fill="none" />
              {/* Necklace */}
              <path d="M38 74 Q50 82 62 74" stroke={accentColor} strokeWidth="2" fill="none" />
              {/* Royal Gown */}
              <path d="M20 80 Q50 98 80 80 L80 110 L20 110 Z" fill={coatColor} opacity="0.9" />
            </g>
          )}

          {rank === 'J' && (
            <g>
              {/* Knight Helmet / Cap */}
              <path d="M25 38 Q50 18 75 38 L75 48 L25 48 Z" fill={accentColor} stroke={mainColor} strokeWidth="2" />
              <path d="M68 32 Q85 10 80 2 Q70 12 66 30" fill={mainColor} />
              {/* Face */}
              <path d="M32 48 L68 48 L68 75 Q50 85 32 75 Z" fill="#F8FAFC" stroke={mainColor} strokeWidth="2" />
              <circle cx="43" cy="56" r="1.5" fill="#111827" />
              <circle cx="57" cy="56" r="1.5" fill="#111827" />
              <path d="M45 66 Q50 70 55 66" stroke={mainColor} strokeWidth="2" fill="none" />
              {/* Knight Armor */}
              <path d="M18 75 Q50 92 82 75 L82 110 L18 110 Z" fill={coatColor} />
            </g>
          )}
        </svg>
      </div>

      {/* Center Divider Line */}
      <div className="w-full h-[1px] bg-[#222C38]/40 my-0.5" />

      {/* Bottom Half (Mirrored 180°) */}
      <div className="w-full h-1/2 flex items-center justify-center relative transform rotate-180">
        <svg className="w-full h-full" viewBox="0 0 100 110" fill="none" preserveAspectRatio="xMidYMid meet">
          {rank === 'K' && (
            <g>
              <path d="M20 35 L35 15 L50 28 L65 15 L80 35 L70 45 L30 45 Z" fill={mainColor} stroke="#111827" strokeWidth="2" />
              <circle cx="35" cy="12" r="3" fill={accentColor} />
              <circle cx="50" cy="22" r="3.5" fill={accentColor} />
              <circle cx="65" cy="12" r="3" fill={accentColor} />
              <path d="M30 42 Q50 32 70 42 L70 75 Q50 85 30 75 Z" fill="#F8FAFC" stroke={mainColor} strokeWidth="2" />
              <circle cx="40" cy="50" r="1.5" fill="#111827" />
              <circle cx="60" cy="50" r="1.5" fill="#111827" />
              <path d="M38 60 Q50 68 62 60" stroke={mainColor} strokeWidth="3" fill="none" />
              <path d="M42 66 Q50 74 58 66" stroke={mainColor} strokeWidth="2" fill="none" />
              <line x1="15" y1="20" x2="15" y2="85" stroke={accentColor} strokeWidth="3" />
              <path d="M10 20 L20 20 L15 10 Z" fill={mainColor} />
              <path d="M20 75 Q50 95 80 75 L80 110 L20 110 Z" fill={coatColor} opacity="0.9" />
            </g>
          )}

          {rank === 'Q' && (
            <g>
              <path d="M25 35 L38 18 L50 30 L62 18 L75 35 L68 45 L32 45 Z" fill={mainColor} stroke="#111827" strokeWidth="2" />
              <circle cx="50" cy="14" r="4" fill={accentColor} />
              <path d="M25 40 Q50 28 75 40 Q80 70 70 82 Q50 92 30 82 Z" fill="#F8FAFC" stroke={mainColor} strokeWidth="2" />
              <circle cx="42" cy="52" r="1.5" fill="#111827" />
              <circle cx="58" cy="52" r="1.5" fill="#111827" />
              <path d="M44 65 Q50 70 56 65" stroke={mainColor} strokeWidth="2.5" fill="none" />
              <path d="M38 74 Q50 82 62 74" stroke={accentColor} strokeWidth="2" fill="none" />
              <path d="M20 80 Q50 98 80 80 L80 110 L20 110 Z" fill={coatColor} opacity="0.9" />
            </g>
          )}

          {rank === 'J' && (
            <g>
              <path d="M25 38 Q50 18 75 38 L75 48 L25 48 Z" fill={accentColor} stroke={mainColor} strokeWidth="2" />
              <path d="M68 32 Q85 10 80 2 Q70 12 66 30" fill={mainColor} />
              <path d="M32 48 L68 48 L68 75 Q50 85 32 75 Z" fill="#F8FAFC" stroke={mainColor} strokeWidth="2" />
              <circle cx="43" cy="56" r="1.5" fill="#111827" />
              <circle cx="57" cy="56" r="1.5" fill="#111827" />
              <path d="M45 66 Q50 70 55 66" stroke={mainColor} strokeWidth="2" fill="none" />
              <path d="M18 75 Q50 92 82 75 L82 110 L18 110 Z" fill={coatColor} />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

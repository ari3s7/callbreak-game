import React from 'react';

export const CardBack: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#11151C] rounded-md border border-[#222C38] p-1 shadow-md flex items-center justify-center relative overflow-hidden select-none">
      {/* Outer Cyan Inset Border */}
      <div className="w-full h-full border border-[#00B8E6]/40 rounded flex items-center justify-center relative bg-[#161C25]/80">
        {/* Geometric Lattice Pattern */}
        <div className="absolute inset-0 opacity-25">
          <svg className="w-full h-full" width="100%" height="100%">
            <pattern id="cardBackPattern" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M0 8 L8 0 L16 8 L8 16 Z" fill="none" stroke="#00D5FF" strokeWidth="1" />
              <circle cx="8" cy="8" r="1.5" fill="#FF3B4E" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#cardBackPattern)" />
          </svg>
        </div>

        {/* Center Emblem */}
        <div className="z-10 w-8 h-8 rounded-full border border-[#00D5FF] bg-[#0B0E13] flex items-center justify-center shadow-cyan-sm">
          <span className="text-[#00D5FF] text-xs font-bold font-display">♠</span>
        </div>
      </div>
    </div>
  );
};

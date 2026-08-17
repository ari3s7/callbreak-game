import React, { useState } from 'react';
import { soundFx } from '../../audio/soundSystem.js';

interface CallSelectorProps {
  onSelectCall: (call: number) => void;
}

export const CallSelector: React.FC<CallSelectorProps> = ({ onSelectCall }) => {
  const [selected, setSelected] = useState<number | null>(3);

  const handleConfirm = () => {
    if (selected !== null) {
      soundFx.playCardClick();
      onSelectCall(selected);
    }
  };

  return (
    <div className="bg-[#11151C]/95 border-2 border-[#00D5FF] rounded-xl p-3 sm:p-3.5 max-w-[320px] sm:max-w-sm w-full shadow-2xl backdrop-blur-md shadow-cyan-glow z-30">
      <div className="text-center mb-2">
        <div className="text-[9px] tracking-[0.2em] text-[#00D5FF] uppercase font-mono font-bold">
          BIDDING PHASE
        </div>
        <h3 className="text-sm sm:text-base font-bold font-display text-[#F1F5F9]">
          SELECT YOUR CALL
        </h3>
        <p className="text-[10px] font-mono text-[#A5AFBD]">
          Review your hand below & predict tricks
        </p>
      </div>

      {/* Button Grid */}
      <div className="grid grid-cols-5 gap-1 sm:gap-1.5 my-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
          <button
            key={val}
            onClick={() => {
              soundFx.playCardClick();
              setSelected(val);
            }}
            className={`
              py-1.5 sm:py-2 rounded font-mono font-bold text-xs transition-all duration-150 border
              ${
                selected === val
                  ? 'bg-[#00D5FF] text-[#0B0E13] border-[#00D5FF] shadow-cyan-glow scale-105'
                  : 'bg-[#161C25] text-[#F1F5F9] border-[#222C38] hover:border-[#00D5FF] hover:text-[#00D5FF]'
              }
            `}
          >
            {val.toString().padStart(2, '0')}
          </button>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleConfirm}
        disabled={selected === null}
        className="w-full py-2 rounded-lg bg-[#00B8E6] text-[#0B0E13] font-bold font-mono tracking-wider text-xs uppercase hover:bg-[#00D5FF] transition-all shadow-md disabled:opacity-50 active:scale-98"
      >
        CONFIRM CALL [{selected ? selected.toString().padStart(2, '0') : '--'}]
      </button>
    </div>
  );
};

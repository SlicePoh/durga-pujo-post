import React, { useState, useEffect } from 'react';

export default function LivePassengersCounter() {
  const [passengerCount, setPassengerCount] = useState(8);

  useEffect(() => {
    let timeoutId;
    const updateCount = () => {
      setPassengerCount(prev => {
        // Bounded random walk between 6 and 14 kids in Omni
        const delta = Math.random() < (prev < 10 ? 0.6 : 0.4) ? 1 : -1;
        const step = delta * (1 + Math.floor(Math.random() * 2));
        return Math.max(6, Math.min(14, prev + step));
      });
      timeoutId = setTimeout(updateCount, 3000 + Math.random() * 4000);
    };

    timeoutId = setTimeout(updateCount, 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div 
      className="fixed left-1/2 top-5 z-30 -translate-x-1/2 glass-pill px-4 py-1.5 rounded-full inline-flex items-center gap-2.5 text-sm font-medium text-white shadow-xl border border-white/20"
      aria-live="polite"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]"></span>
      </span>
      <span className="font-semibold tabular-nums text-emerald-300">{passengerCount}</span>
      <span className="text-white/80 text-xs font-normal">pandal hoppers online</span>
    </div>
  );
}

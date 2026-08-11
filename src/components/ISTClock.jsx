import React, { useState, useEffect } from 'react';

const ISTFormatter = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
});

export default function ISTClock() {
  const [timeState, setTimeState] = useState(null);

  useEffect(() => {
    const updateTime = () => {
      const parts = ISTFormatter.formatToParts(new Date());
      const hour = parts.find(p => p.type === 'hour')?.value || '7';
      const minute = parts.find(p => p.type === 'minute')?.value || '15';
      const period = parts.find(p => p.type === 'dayPeriod')?.value?.toUpperCase() || 'AM';
      setTimeState({ hour, minute, period });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed left-5 top-5 z-30 flex items-center gap-3">
      <div className="glass-pill px-3.5 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium text-white shadow-lg border border-white/20">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
        {timeState ? (
          <div className="flex items-center font-mono tabular-nums">
            <span className="font-semibold">{timeState.hour}</span>
            <span className="animate-[blink_1s_step-end_infinite] mx-0.5 text-amber-400 font-bold">:</span>
            <span className="font-semibold">{timeState.minute}</span>
            <span className="ml-1.5 text-xs text-amber-200/80 uppercase tracking-wider">{timeState.period} IST</span>
          </div>
        ) : (
          <span className="text-white/60 text-xs">7:15 AM IST</span>
        )}
      </div>
    </div>
  );
}

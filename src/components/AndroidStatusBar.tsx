import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';

export const AndroidStatusBar: React.FC = () => {
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-8 w-full bg-white/80 px-5 flex items-center justify-between text-[11px] font-semibold text-[#14121B] select-none shrink-0 z-30 border-b border-[#E4E0F0]">
      {/* Time */}
      <span className="font-semibold tracking-tight">{time}</span>

      {/* Center Camera Punch-hole */}
      <div className="w-3.5 h-3.5 rounded-full bg-black/80 border border-black/20 shadow-inner flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[#1e1b4b]" />
      </div>

      {/* System Icons: 5G, Wi-Fi, Battery */}
      <div className="flex items-center gap-1.5 text-[#14121B]">
        <span className="text-[10px] font-bold text-[#5B5670]">5G</span>
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-semibold">98%</span>
          <div className="w-4 h-2 rounded-[3px] border border-[#14121B] p-[1px] flex items-center">
            <div className="w-full h-full bg-[#3CC38A] rounded-[1px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';

export const EmptyBenefitCards: React.FC = () => {
  const benefits = [
    {
      emoji: '💬',
      title: 'Upload a chat',
      desc: 'Drop any screenshot from Hinge, Tinder, Bumble, or iMessage.',
    },
    {
      emoji: '⚡',
      title: 'Get replies instantly',
      desc: 'Witty, smooth, or direct lines written for that exact conversation.',
    },
    {
      emoji: '🎯',
      title: 'See if they like you',
      desc: 'Interest level, green flags, and red flags at a single glance.',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
      {benefits.map((b, idx) => (
        <div
          key={idx}
          className="wm-card p-4 sm:p-5 flex flex-col items-center text-center space-y-2 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#B79CFF]/20 to-[#FF9AC4]/20 flex items-center justify-center text-2xl shadow-xs">
            {b.emoji}
          </div>
          <h3 className="text-sm font-bold text-[#14121B]">
            {b.title}
          </h3>
          <p className="text-xs text-[#5B5670] leading-relaxed">
            {b.desc}
          </p>
        </div>
      ))}
    </div>
  );
};

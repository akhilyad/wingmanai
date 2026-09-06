import React from 'react';

interface WingManLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showCaption?: boolean;
  className?: string;
}

export const WingManLogo: React.FC<WingManLogoProps> = ({
  size = 'md',
  showWordmark = false,
  showCaption = false,
  className = '',
}) => {
  const iconSizeClasses = {
    sm: 'w-7 h-7 p-1.5',
    md: 'w-9 h-9 p-2',
    lg: 'w-14 h-14 p-3.5',
    xl: 'w-20 h-20 p-5',
  };

  const wordmarkSizes = {
    sm: 'text-sm',
    md: 'text-base font-bold',
    lg: 'text-2xl font-extrabold',
    xl: 'text-3xl font-extrabold',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Soft circular badge with accent gradient */}
      <div
        className={`rounded-full flex items-center justify-center shrink-0 shadow-md ${iconSizeClasses[size]}`}
        style={{
          background: 'linear-gradient(135deg, #B79CFF 0%, #FF9AC4 100%)',
          boxShadow: '0 4px 16px rgba(183, 156, 255, 0.35)',
        }}
      >
        {/* Simple crisp SVG Wing / Paper-Plane glyph */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full transform -rotate-12 translate-x-[1px] -translate-y-[1px]"
        >
          {/* Wing / paper plane stylized icon */}
          <path d="M2.5 12.5L21.5 3.5L14.5 21.5L10.5 14L2.5 12.5Z" fill="rgba(255, 255, 255, 0.2)" />
          <path d="M10.5 14L21.5 3.5" />
        </svg>
      </div>

      {(showWordmark || showCaption) && (
        <div className="flex flex-col">
          {showWordmark && (
            <span
              className={`tracking-tight text-[#14121B] leading-none ${wordmarkSizes[size]}`}
            >
              WingMan
            </span>
          )}
          {showCaption && (
            <span className="text-[11px] font-medium text-[#5B5670] tracking-normal mt-0.5">
              AI dating coach
            </span>
          )}
        </div>
      )}
    </div>
  );
};

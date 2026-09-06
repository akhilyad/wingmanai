import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { WingManLogo } from './WingManLogo';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter');

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    // Logo animates 0.8 -> 1 over 500ms, holds ~800ms (total 1300ms)
    const holdTimer = setTimeout(() => {
      setPhase('exit');
    }, 1300);

    // Overlay fades & slides up over 400ms (total 1700ms < 2s)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1700);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(completeTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      role="button"
      tabIndex={0}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer pointer-events-auto select-none ${
        phase === 'exit' ? 'splash-overlay-out' : ''
      }`}
      style={{
        background: 'linear-gradient(160deg, #E9E3F8 0%, #D9EEF2 60%, #F3E7F1 100%)',
      }}
    >
      <div
        className={`flex flex-col items-center text-center p-6 ${
          phase === 'enter' ? 'splash-logo-in' : ''
        }`}
      >
        <WingManLogo size="xl" className="flex-col !gap-4" />
        <h1 className="text-3xl font-black tracking-tight text-[#14121B] mt-4">
          WingMan
        </h1>
        <p className="text-xs font-semibold text-[#5B5670] tracking-wide mt-1 uppercase">
          AI dating coach
        </p>

        {/* Explicit Enter Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          className="mt-8 px-6 py-2.5 bg-[#14121B] hover:bg-[#252230] text-white rounded-full font-semibold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          <span>Enter WingMan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};


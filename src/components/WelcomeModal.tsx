import React, { useState } from 'react';
import { ArrowRight, ChevronRight, X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const slides = [
    {
      emoji: '💬',
      title: 'Upload a chat',
      subtitle: 'Screenshot any dating conversation or bio',
      gradient: 'from-[#E9E3F8] to-[#D9EEF2]',
    },
    {
      emoji: '⚡',
      title: 'Get replies instantly',
      subtitle: 'Witty, smooth, or direct lines written for that exact chat',
      gradient: 'from-[#D9EEF2] to-[#F3E7F1]',
    },
    {
      emoji: '🎯',
      title: 'See if they like you',
      subtitle: 'Interest level, green flags, and red flags at a glance',
      gradient: 'from-[#F3E7F1] to-[#E9E3F8]',
    },
  ];

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm cursor-pointer"
    >
      <div className="w-full max-w-sm bg-white rounded-[24px] shadow-2xl p-6 sm:p-7 flex flex-col relative overflow-hidden text-center animate-in fade-in zoom-in-95 duration-200 cursor-default">
        {/* Skip button top right */}
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-[#8E88A0] hover:text-[#14121B] px-2 py-1 rounded-lg transition-colors"
          >
            Skip
          </button>
        </div>

        {/* Current slide content */}
        <div className="py-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#B79CFF]/20 to-[#FF9AC4]/30 flex items-center justify-center text-4xl mb-6 shadow-sm">
            {slides[currentStep].emoji}
          </div>

          <h2 className="text-xl font-bold text-[#14121B] tracking-tight mb-2">
            {slides[currentStep].title}
          </h2>

          <p className="text-sm text-[#5B5670] leading-relaxed max-w-[260px]">
            {slides[currentStep].subtitle}
          </p>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentStep
                  ? 'w-6 bg-[#14121B]'
                  : 'w-2 bg-[#E4E0F0] hover:bg-[#8E88A0]'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Action Button */}
        {currentStep === slides.length - 1 ? (
          <button
            type="button"
            onClick={onClose}
            className="w-full h-12 bg-[#14121B] hover:bg-[#252230] text-white rounded-full font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="w-full h-12 bg-[#14121B] hover:bg-[#252230] text-white rounded-full font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

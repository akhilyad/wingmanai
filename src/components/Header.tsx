import React from 'react';
import {
  SlidersHorizontal,
  RefreshCw,
  Smartphone,
  Monitor,
  Menu,
} from 'lucide-react';
import { WingManLogo } from './WingManLogo';

interface HeaderProps {
  activeTab: 'analyzer' | 'workshop' | 'strategy';
  setActiveTab: (tab: 'analyzer' | 'workshop' | 'strategy') => void;
  isAndroidFrame: boolean;
  setIsAndroidFrame: (val: boolean) => void;
  onOpenPlayStoreModal: () => void;
  customInstructions: string;
  onOpenCustomInstructions: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isAndroidFrame,
  setIsAndroidFrame,
  onOpenPlayStoreModal,
  customInstructions,
  onOpenCustomInstructions,
}) => {
  const hasCustomInstructions = customInstructions.trim().length > 0;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-[#E4E0F0] h-14 sm:h-16 transition-all">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between gap-3">
        {/* Left: Brand Logo & Wordmark */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setActiveTab('analyzer')}
        >
          <WingManLogo size="sm" showWordmark showCaption={false} />
        </div>

        {/* Right: Custom Instructions Icon + Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Custom Instructions Icon Button */}
          <button
            id="header-custom-instructions-btn"
            type="button"
            onClick={onOpenCustomInstructions}
            className="relative p-2 sm:px-3 sm:py-1.5 rounded-full hover:bg-[#F1EFF6] text-[#14121B] border border-transparent hover:border-[#E4E0F0] transition-all flex items-center gap-1.5"
            title="Custom Instructions"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#14121B]" />
            <span className="hidden sm:inline text-xs font-semibold text-[#14121B]">
              Instructions
            </span>

            {/* Filled dot when instructions are non-empty */}
            {hasCustomInstructions && (
              <span className="w-2 h-2 rounded-full bg-[#3CC38A] ring-2 ring-white shrink-0 animate-pulse" />
            )}
          </button>

          {/* Desktop Display View Toggle (1080x2400 Phone / Wide) */}
          <div className="hidden sm:flex items-center bg-[#F1EFF6] rounded-full p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setIsAndroidFrame(true)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all text-[11px] font-semibold ${
                isAndroidFrame
                  ? 'bg-white text-[#14121B] shadow-sm'
                  : 'text-[#5B5670] hover:text-[#14121B]'
              }`}
              title="1080×2400 Mobile View"
            >
              <Smartphone className="w-3 h-3" />
              <span>Mobile</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAndroidFrame(false)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all text-[11px] font-semibold ${
                !isAndroidFrame
                  ? 'bg-white text-[#14121B] shadow-sm'
                  : 'text-[#5B5670] hover:text-[#14121B]'
              }`}
              title="Wide View"
            >
              <Monitor className="w-3 h-3" />
              <span>Wide</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

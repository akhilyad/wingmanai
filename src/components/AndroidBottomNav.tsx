import React from 'react';
import {
  MessageSquareHeart,
  PenTool,
  HelpCircle,
  Smartphone,
  SlidersHorizontal,
} from 'lucide-react';

interface AndroidBottomNavProps {
  activeTab: 'analyzer' | 'workshop' | 'strategy';
  setActiveTab: (tab: 'analyzer' | 'workshop' | 'strategy') => void;
  onOpenPlayStoreKit: () => void;
  customInstructions?: string;
  onOpenCustomInstructions?: () => void;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenPlayStoreKit,
  customInstructions = '',
  onOpenCustomInstructions,
}) => {
  return (
    <nav className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E4E0F0] px-2 py-2 flex items-center justify-around select-none">
      {/* Tab 1: Analyzer */}
      <button
        type="button"
        onClick={() => setActiveTab('analyzer')}
        className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-2xl transition-all relative ${
          activeTab === 'analyzer' ? 'text-[#14121B]' : 'text-[#8E88A0] hover:text-[#14121B]'
        }`}
      >
        <div
          className={`px-3.5 py-1 rounded-full transition-all ${
            activeTab === 'analyzer'
              ? 'bg-[#F1EFF6] shadow-xs'
              : 'bg-transparent'
          }`}
        >
          <MessageSquareHeart className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold tracking-tight">Analyzer</span>
      </button>

      {/* Tab 2: Workshop */}
      <button
        type="button"
        onClick={() => setActiveTab('workshop')}
        className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-2xl transition-all relative ${
          activeTab === 'workshop' ? 'text-[#14121B]' : 'text-[#8E88A0] hover:text-[#14121B]'
        }`}
      >
        <div
          className={`px-3.5 py-1 rounded-full transition-all ${
            activeTab === 'workshop'
              ? 'bg-[#F1EFF6] shadow-xs'
              : 'bg-transparent'
          }`}
        >
          <PenTool className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold tracking-tight">Ask WingMan</span>
      </button>

      {/* Tab 3: Strategy Coach */}
      <button
        type="button"
        onClick={() => setActiveTab('strategy')}
        className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-2xl transition-all relative ${
          activeTab === 'strategy' ? 'text-[#14121B]' : 'text-[#8E88A0] hover:text-[#14121B]'
        }`}
      >
        <div
          className={`px-3.5 py-1 rounded-full transition-all ${
            activeTab === 'strategy'
              ? 'bg-[#F1EFF6] shadow-xs'
              : 'bg-transparent'
          }`}
        >
          <HelpCircle className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold tracking-tight">Coach</span>
      </button>

      {/* Tab 4: Custom Instructions / Style */}
      {onOpenCustomInstructions && (
        <button
          type="button"
          onClick={onOpenCustomInstructions}
          className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-2xl transition-all relative ${
            customInstructions.trim()
              ? 'text-[#14121B]'
              : 'text-[#8E88A0] hover:text-[#14121B]'
          }`}
          title="Set custom instructions"
        >
          <div
            className={`px-3.5 py-1 rounded-full transition-all relative ${
              customInstructions.trim() ? 'bg-[#3CC38A]/15' : 'bg-transparent'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            {customInstructions.trim() && (
              <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-[#3CC38A] animate-pulse" />
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight">Custom</span>
        </button>
      )}

      {/* Tab 5: Play Store Export */}
      <button
        type="button"
        onClick={onOpenPlayStoreKit}
        className="flex flex-col items-center gap-1 px-2.5 py-1 rounded-2xl text-[#14121B] hover:opacity-80 transition-all"
      >
        <div className="px-3.5 py-1 rounded-full bg-[#F1EFF6] transition-all">
          <Smartphone className="w-5 h-5 text-[#14121B]" />
        </div>
        <span className="text-[10px] font-bold tracking-tight">Play Store</span>
      </button>
    </nav>
  );
};

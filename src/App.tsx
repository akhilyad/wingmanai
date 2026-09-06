import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ConversationUpload } from './components/ConversationUpload';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { ReplyWorkshop } from './components/ReplyWorkshop';
import { StrategyCoach } from './components/StrategyCoach';
import { PlayStoreModal } from './components/PlayStoreModal';
import { CustomInstructionsModal } from './components/CustomInstructionsModal';
import { AndroidBottomNav } from './components/AndroidBottomNav';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { AndroidGestureBar } from './components/AndroidGestureBar';
import { SplashScreen } from './components/SplashScreen';
import { WelcomeModal } from './components/WelcomeModal';
import { EmptyBenefitCards } from './components/EmptyBenefitCards';
import { AnalysisResult } from './types';
import { Smartphone } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'workshop' | 'strategy'>('analyzer');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [workshopDraft, setWorkshopDraft] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Launch Experience state (Splash Screen & Welcome Onboarding)
  const [showSplash, setShowSplash] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // Custom Instructions & Style Preferences State
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [isCustomInstructionsOpen, setIsCustomInstructionsOpen] = useState(false);
  const [isSavingInstructions, setIsSavingInstructions] = useState(false);

  // Android View / 1080x2400 Phone Simulator State
  const [isAndroidFrame, setIsAndroidFrame] = useState(false);
  const [isPlayStoreModalOpen, setIsPlayStoreModalOpen] = useState(false);

  // Check Splash & Welcome on initial mount
  useEffect(() => {
    try {
      const splashSeen = sessionStorage.getItem('wingman_splash_seen');
      if (!splashSeen) {
        setShowSplash(true);
      } else {
        // Returning user in same session, check welcome
        const welcomeSeen = localStorage.getItem('wingman_welcome_seen');
        if (!welcomeSeen) {
          setShowWelcome(true);
        }
      }
    } catch {
      // Fallback if storage blocked
    }
  }, []);

  const handleSplashComplete = useCallback(() => {
    try {
      sessionStorage.setItem('wingman_splash_seen', 'true');
    } catch {}
    setShowSplash(false);

    try {
      const welcomeSeen = localStorage.getItem('wingman_welcome_seen');
      if (!welcomeSeen) {
        setShowWelcome(true);
      }
    } catch {}
  }, []);

  const handleWelcomeClose = useCallback(() => {
    try {
      localStorage.setItem('wingman_welcome_seen', 'true');
    } catch {}
    setShowWelcome(false);
  }, []);

  // Load custom instructions on boot from backend
  useEffect(() => {
    fetch('/api/custom-instructions')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to load');
      })
      .then((data) => {
        if (data?.instructions && typeof data.instructions === 'string') {
          setCustomInstructions(data.instructions);
        }
      })
      .catch((err) => {
        console.warn('Could not load saved custom instructions from server:', err);
        try {
          const cached = localStorage.getItem('wingman_custom_instructions');
          if (cached) setCustomInstructions(cached);
        } catch {}
      });
  }, []);

  // Save custom instructions to backend & session
  const handleSaveInstructions = async (newInstructions: string) => {
    setIsSavingInstructions(true);
    try {
      const response = await fetch('/api/custom-instructions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructions: newInstructions }),
      });

      if (!response.ok) {
        throw new Error('Failed to save custom instructions');
      }

      const data = await response.json();
      const updated = data.instructions ?? newInstructions;
      setCustomInstructions(updated);

      try {
        localStorage.setItem('wingman_custom_instructions', updated);
      } catch {}
    } catch (err: any) {
      console.error('Error saving instructions:', err);
      setErrorMessage(err.message || 'Error saving custom instructions.');
      throw err;
    } finally {
      setIsSavingInstructions(false);
    }
  };

  // Analyze screenshots (single or multiple) via API (Gemini 3.8 Flash)
  const handleAnalyzeImages = async (
    images: Array<{ base64: string; mimeType: string; name?: string }>,
    userNote?: string
  ) => {
    if (!images || images.length === 0) return;
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const payloadImages = images.map((img) => ({
        imageBase64: img.base64,
        mimeType: img.mimeType,
        name: img.name,
      }));

      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: payloadImages,
          imageBase64: images[0]?.base64,
          mimeType: images[0]?.mimeType,
          userNote,
          customInstructions,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to analyze screenshots');
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);
      setActiveTab('analyzer');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error processing screenshot(s). Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeImage = async (imageBase64: string, mimeType: string, userNote?: string) => {
    return handleAnalyzeImages([{ base64: imageBase64, mimeType }], userNote);
  };

  // Analyze text transcript via API
  const handleAnalyzeText = async (conversationText: string, userNote?: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/analyze-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationText,
          userNote,
          customInstructions,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to analyze text conversation');
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);
      setActiveTab('analyzer');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error analyzing text. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendToWorkshop = (replyText: string) => {
    setWorkshopDraft(replyText);
    setActiveTab('workshop');
  };

  const handleClearAnalysis = () => {
    setAnalysisResult(null);
  };

  // Render Inner Content
  const renderAppContent = () => (
    <div className="space-y-6">
      {/* Error Alert if any */}
      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-700 text-xs rounded-2xl p-4 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-600 hover:text-rose-800 text-xs underline font-semibold ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tab 1: Conversation Analyzer */}
      {activeTab === 'analyzer' && (
        <div className="space-y-6">
          {/* Upload Card */}
          <ConversationUpload
            onAnalyzeImage={handleAnalyzeImage}
            onAnalyzeImages={handleAnalyzeImages}
            onAnalyzeText={handleAnalyzeText}
            isLoading={isAnalyzing}
            customInstructions={customInstructions}
            onOpenCustomInstructions={() => setIsCustomInstructionsOpen(true)}
          />

          {/* If analysis exists, display results stack (which ends with Ask WingMan Workshop) */}
          {analysisResult ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-[#14121B]">
                  Analysis Results
                </span>
                <button
                  type="button"
                  onClick={handleClearAnalysis}
                  className="text-[11px] font-semibold text-[#8E88A0] hover:text-[#14121B] underline transition-colors"
                >
                  Clear & upload new
                </button>
              </div>

              <AnalysisDisplay
                analysis={analysisResult}
                onSendToWorkshop={handleSendToWorkshop}
                customInstructions={customInstructions}
                onOpenCustomInstructions={() => setIsCustomInstructionsOpen(true)}
              />
            </div>
          ) : (
            /* Empty State: 3 Benefit Cards */
            <EmptyBenefitCards />
          )}
        </div>
      )}

      {/* Tab 2: Ask WingMan (Workshop Dedicated View) */}
      {activeTab === 'workshop' && (
        <ReplyWorkshop
          analysis={analysisResult}
          initialDraft={workshopDraft}
          customInstructions={customInstructions}
          onOpenCustomInstructions={() => setIsCustomInstructionsOpen(true)}
        />
      )}

      {/* Tab 3: Strategy Coach */}
      {activeTab === 'strategy' && (
        <StrategyCoach
          customInstructions={customInstructions}
          onOpenCustomInstructions={() => setIsCustomInstructionsOpen(true)}
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col text-[#14121B] relative overflow-x-hidden font-sans">
      {/* 1. Launch Experience: Splash Screen */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* 2. Launch Experience: Welcome Onboarding Modal */}
      <WelcomeModal isOpen={showWelcome} onClose={handleWelcomeClose} />

      {/* Top Sticky Header (same header bar across all states so wordmark never jumps) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAndroidFrame={isAndroidFrame}
        setIsAndroidFrame={setIsAndroidFrame}
        onOpenPlayStoreModal={() => setIsPlayStoreModalOpen(true)}
        customInstructions={customInstructions}
        onOpenCustomInstructions={() => setIsCustomInstructionsOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full mx-auto relative z-10 flex flex-col items-center justify-start p-0 sm:py-6 sm:px-4">
        {/* On mobile screens (<640px), render native mobile view */}
        <div className="block sm:hidden w-full flex-1 flex flex-col">
          <AndroidStatusBar />
          <div className="flex-1 p-3.5 space-y-4">
            {renderAppContent()}
          </div>
          <AndroidBottomNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenPlayStoreKit={() => setIsPlayStoreModalOpen(true)}
            customInstructions={customInstructions}
            onOpenCustomInstructions={() => setIsCustomInstructionsOpen(true)}
          />
          <AndroidGestureBar />
        </div>

        {/* On tablet/desktop screens: Either 1080x2400 Android Phone Frame OR Wide Mode */}
        <div className="hidden sm:flex w-full flex-col items-center justify-start">
          {isAndroidFrame ? (
            /* 1080x2400 Android Smartphone Chassis Simulator */
            <div className="flex flex-col items-center gap-3">
              {/* Compact Spec Indicator Bar */}
              <div className="flex items-center gap-2 bg-white/80 border border-[#E4E0F0] px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-md text-[11px] shrink-0">
                <Smartphone className="w-3.5 h-3.5 text-[#14121B] shrink-0" />
                <span className="font-bold text-[#14121B]">Google Pixel / Galaxy</span>
                <span className="text-[#8E88A0]">•</span>
                <span className="font-semibold text-[#14121B]">1080 × 2400</span>
                <span className="text-[#8E88A0]">•</span>
                <span className="text-[#5B5670]">20:9 Aspect</span>
              </div>

              {/* Physical Phone Chassis */}
              <div className="relative">
                {/* Physical Hardware Buttons */}
                <div className="absolute -left-[10px] top-24 w-[3px] h-10 bg-[#8E88A0] rounded-l-sm" />
                <div className="absolute -left-[10px] top-38 w-[3px] h-10 bg-[#8E88A0] rounded-l-sm" />
                <div className="absolute -right-[10px] top-28 w-[3px] h-14 bg-[#8E88A0] rounded-r-sm" />

                {/* Outer Bezel */}
                <div className="w-[390px] max-w-[94vw] h-[780px] max-h-[82vh] bg-white border-[8px] border-[#252230] rounded-[48px] shadow-[0_20px_60px_rgba(40,30,80,0.15)] ring-1 ring-black/5 flex flex-col overflow-hidden relative">
                  {/* Android 14 System Status Bar */}
                  <AndroidStatusBar />

                  {/* Phone Scrollable Screen Content */}
                  <div className="flex-1 overflow-y-auto p-3.5 space-y-4 no-scrollbar relative bg-[#F4F1FB]">
                    {renderAppContent()}
                  </div>

                  {/* Android Bottom Navigation Bar */}
                  <AndroidBottomNav
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onOpenPlayStoreKit={() => setIsPlayStoreModalOpen(true)}
                    customInstructions={customInstructions}
                    onOpenCustomInstructions={() => setIsCustomInstructionsOpen(true)}
                  />

                  {/* Android System Home Gesture Bar */}
                  <AndroidGestureBar />
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#5B5670] pt-1">
                <span>Touch-scroll inside to test</span>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setIsPlayStoreModalOpen(true)}
                  className="text-[#14121B] font-semibold underline underline-offset-2"
                >
                  Play Store Package Kit
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setIsAndroidFrame(false)}
                  className="text-[#5B5670] hover:text-[#14121B] underline underline-offset-2"
                >
                  Switch to Wide View
                </button>
              </div>
            </div>
          ) : (
            /* Wide Responsive View (Default) */
            <div className="max-w-4xl w-full px-4 sm:px-6 py-2 space-y-6">
              {renderAppContent()}
            </div>
          )}
        </div>
      </main>

      {/* Play Store Modal */}
      <PlayStoreModal
        isOpen={isPlayStoreModalOpen}
        onClose={() => setIsPlayStoreModalOpen(false)}
      />

      {/* Custom Instructions Modal */}
      <CustomInstructionsModal
        isOpen={isCustomInstructionsOpen}
        onClose={() => setIsCustomInstructionsOpen(false)}
        instructions={customInstructions}
        onSave={handleSaveInstructions}
        isSaving={isSavingInstructions}
      />

      {/* Footer */}
      <footer className="border-t border-[#E4E0F0] py-6 bg-white/60 backdrop-blur-md relative z-10 text-xs text-[#5B5670]">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3CC38A]" />
            <span className="font-bold text-[#14121B]">WingMan AI</span>
            <span>•</span>
            <span>AI dating conversation coach</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setIsCustomInstructionsOpen(true)}
              className="text-[#14121B] hover:underline"
            >
              Custom Instructions
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsPlayStoreModalOpen(true)}
              className="text-[#14121B] hover:underline"
            >
              Google Play Kit
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

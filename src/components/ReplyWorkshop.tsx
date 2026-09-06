import React, { useState, useEffect } from 'react';
import {
  Lock,
  Sparkles,
  SlidersHorizontal,
  Check,
  Copy,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { AnalysisResult, WorkshopFeedback } from '../types';

interface ReplyWorkshopProps {
  analysis?: AnalysisResult | null;
  initialDraft?: string;
  customInstructions?: string;
  onOpenCustomInstructions?: () => void;
}

export const ReplyWorkshop: React.FC<ReplyWorkshopProps> = ({
  analysis,
  initialDraft = '',
  customInstructions = '',
  onOpenCustomInstructions,
}) => {
  const [draft, setDraft] = useState(initialDraft);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<WorkshopFeedback | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Sync draft if parent changes initialDraft
  useEffect(() => {
    if (initialDraft) {
      setDraft(initialDraft);
    }
  }, [initialDraft]);

  const hasAnalysis = Boolean(analysis);

  // Extract recent transcript bubbles
  const recentBubbles = analysis?.transcript?.slice(-3) || [];

  // Build context summary string for LLM call
  const contextSummary = analysis
    ? `Match: ${analysis.matchName} on ${analysis.platform}. Vibe: ${analysis.vibe}. Interest: ${analysis.interestScore}%. Subtext: ${analysis.subtextAnalysis}. Coach Tip: ${analysis.coachTip}`
    : '';

  const handleWorkshop = async () => {
    if (!draft.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/workshop-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftReply: draft,
          conversationContext: contextSummary || 'General dating app conversation exchange',
          customInstructions,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to workshop reply');
      }
      const data = await response.json();
      setFeedback(data);
    } catch (err: any) {
      console.error(err);
      alert('Unable to refine reply right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getEnergyBadge = (type: string) => {
    switch (type) {
      case 'genuine':
        return { label: 'Authentic & Grounded', color: 'bg-[#3CC38A]/10 text-[#3CC38A] border-[#3CC38A]/25' };
      case 'playful':
        return { label: 'Playful & Charismatic', color: 'bg-[#B79CFF]/15 text-[#14121B] border-[#B79CFF]/30' };
      case 'a_bit_try_hard':
        return { label: 'A Bit Try-Hard', color: 'bg-[#F5A623]/15 text-[#F5A623] border-[#F5A623]/30' };
      case 'manipulative':
        return { label: 'Manipulative / Inauthentic', color: 'bg-rose-500/10 text-rose-600 border-rose-500/20' };
      default:
        return { label: 'Slightly Stiff', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' };
    }
  };

  return (
    <div id="ask-wingman-section" className="space-y-5">
      {/* Ask WingMan Card */}
      <div className="wm-card p-5 sm:p-7 space-y-5">
        {/* Header with Title, Subtitle, and Custom Instructions link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1EFF6] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#14121B] tracking-tight flex items-center gap-2">
              <span>Ask WingMan</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#B79CFF]/20 text-[#14121B]">
                Reply Workshop
              </span>
            </h2>
            <p className="text-xs text-[#5B5670] mt-0.5">
              Paste your draft and WingMan will refine it
            </p>
          </div>

          {/* Small "Custom Instructions" text link in the card header */}
          {onOpenCustomInstructions && (
            <button
              type="button"
              onClick={onOpenCustomInstructions}
              className="text-xs font-semibold text-[#5B5670] hover:text-[#14121B] underline underline-offset-4 decoration-[#E4E0F0] hover:decoration-[#14121B] flex items-center gap-1 self-start sm:self-auto transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#B79CFF]" />
              <span>Custom Instructions</span>
              {customInstructions.trim() && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#3CC38A]" />
              )}
            </button>
          )}
        </div>

        {/* 1. Read-Only Frozen Conversation Context Card ("What WingMan remembers") */}
        <div
          aria-readonly="true"
          className="rounded-[18px] p-4 border border-[#E4E0F0] bg-[#F7F5FC] relative space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B5670]">
              What WingMan remembers
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-[#8E88A0]">
              <Lock className="w-3.5 h-3.5" />
              <span>Frozen context</span>
            </div>
          </div>

          {hasAnalysis && analysis ? (
            <div className="space-y-2.5">
              {/* Short paragraph summary */}
              <p className="text-xs text-[#14121B] leading-relaxed">
                <strong className="font-semibold">{analysis.matchName}</strong> ({analysis.platform}):{' '}
                <span className="text-[#5B5670]">{analysis.subtextAnalysis}</span>
              </p>

              {/* Vibe and Interest summary */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#E4E0F0] font-semibold text-[#14121B]">
                  They seem: <span className="text-[#B79CFF] capitalize font-bold">{analysis.vibe}</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#E4E0F0] font-semibold text-[#14121B]">
                  Interest: <span className="font-bold text-[#3CC38A]">{analysis.interestScore}%</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#E4E0F0] text-[#5B5670]">
                  Next move: <span className="font-medium text-[#14121B]">{analysis.dynamics?.interestSignals || 'Lead with confidence'}</span>
                </span>
              </div>

              {/* Last 2-3 transcript bubbles */}
              {recentBubbles.length > 0 && (
                <div className="pt-2 border-t border-[#E4E0F0]/60 space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E88A0] block">
                    Recent lines:
                  </span>
                  <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                    {recentBubbles.map((b) => {
                      const isUser = b.sender === 'user';
                      return (
                        <div
                          key={b.id}
                          className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`text-[11px] px-3 py-1.5 rounded-2xl max-w-[85%] leading-snug shadow-xs ${
                              isUser
                                ? 'bg-[#3B82F6] text-white rounded-br-xs'
                                : 'bg-[#F1EFF6] text-[#14121B] rounded-bl-xs border border-[#E4E0F0]/50'
                            }`}
                          >
                            {b.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-2 text-xs text-[#5B5670]">
              <p>No chat analyzed yet. You can still test any draft message below!</p>
              <p className="text-[11px] text-[#8E88A0] mt-0.5">
                (Tip: Upload a screenshot in the Analyzer tab to give WingMan full conversation context.)
              </p>
            </div>
          )}
        </div>

        {/* 2. Your Draft Reply (Single editable field) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="draft-reply-input"
              className="block text-xs font-bold text-[#14121B]"
            >
              Your Draft Reply (What you're tempted to send)
            </label>
            <span className="text-[10px] text-[#8E88A0]">
              Press Ctrl + Enter to refine
            </span>
          </div>
          <textarea
            id="draft-reply-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleWorkshop();
              }
            }}
            placeholder="Type or paste what you were planning to say..."
            className="w-full h-24 rounded-[16px] p-3.5 text-xs text-[#14121B] placeholder:text-[#8E88A0] resize-none outline-none transition-all leading-relaxed bg-[#F7F5FC] border border-[#E4E0F0] focus:border-[#14121B] focus:bg-white shadow-inner"
          />
        </div>

        {/* Action Button: "Vibe Check & Refine" */}
        <div className="flex items-center justify-end pt-1">
          <button
            type="button"
            onClick={handleWorkshop}
            disabled={isLoading || !draft.trim()}
            className="h-11 px-6 wm-btn-primary flex items-center justify-center gap-2 text-xs shadow-sm active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Thinking…</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#FF9AC4]" />
                <span>Vibe Check & Refine</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Workshop Feedback Results */}
      {feedback && (
        <div className="wm-card p-5 sm:p-6 space-y-4 rise">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1EFF6] pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#5B5670] tracking-wider">
                Assessment
              </span>
              <h3 className="text-base font-bold text-[#14121B]">
                Vibe Calibration
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-3 py-1 rounded-full border font-semibold ${
                  getEnergyBadge(feedback.energyType).color
                }`}
              >
                {getEnergyBadge(feedback.energyType).label}
              </span>
              <span className="text-xs font-bold px-3 py-1 bg-[#F7F5FC] border border-[#E4E0F0] rounded-full text-[#14121B]">
                {feedback.authenticityScore}% Authentic
              </span>
            </div>
          </div>

          {/* Wingman commentary */}
          <div className="bg-[#F7F5FC] border border-[#E4E0F0] rounded-[16px] p-3.5 text-xs text-[#14121B] leading-relaxed">
            {feedback.verdictComment}
          </div>

          {/* Genuine Moments vs Try-hard alerts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {feedback.genuineMoments?.length > 0 && (
              <div className="bg-[#3CC38A]/5 border border-[#3CC38A]/20 rounded-[16px] p-3.5 space-y-1.5">
                <span className="text-xs font-bold text-[#3CC38A] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  What works
                </span>
                <ul className="space-y-1 text-xs text-[#5B5670]">
                  {feedback.genuineMoments.map((m, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#3CC38A]">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.tryHardAlerts?.length > 0 && (
              <div className="bg-[#F5A623]/5 border border-[#F5A623]/25 rounded-[16px] p-3.5 space-y-1.5">
                <span className="text-xs font-bold text-[#F5A623] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Watch out
                </span>
                <ul className="space-y-1 text-xs text-[#5B5670]">
                  {feedback.tryHardAlerts.map((a, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#F5A623]">•</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Refined Options */}
          {feedback.refinedOptions?.length > 0 && (
            <div className="pt-2 space-y-2.5">
              <span className="text-xs font-bold text-[#14121B] block">
                Refined Variations
              </span>
              <div className="space-y-2">
                {feedback.refinedOptions.map((opt, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-[16px] bg-[#F7F5FC] border border-[#E4E0F0] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#14121B]">
                        {opt.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(opt.message, i)}
                        className="text-xs font-semibold text-[#5B5670] hover:text-[#14121B] flex items-center gap-1 p-1"
                      >
                        {copiedIndex === i ? (
                          <Check className="w-3.5 h-3.5 text-[#3CC38A]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedIndex === i ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-xs font-medium text-[#14121B] bg-white p-2.5 rounded-xl border border-[#E4E0F0]">
                      "{opt.message}"
                    </p>
                    <p className="text-[11px] text-[#5B5670]">
                      {opt.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

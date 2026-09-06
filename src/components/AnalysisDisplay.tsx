import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { AnalysisResult, ReplyTone } from '../types';
import { ReplyWorkshop } from './ReplyWorkshop';

interface AnalysisDisplayProps {
  analysis: AnalysisResult;
  onSendToWorkshop: (replyText: string, contextSummary: string) => void;
  customInstructions?: string;
  onOpenCustomInstructions?: () => void;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({
  analysis,
  onSendToWorkshop,
  customInstructions = '',
  onOpenCustomInstructions,
}) => {
  const [selectedTone, setSelectedTone] = useState<'Mix' | 'Smooth' | 'Funny' | 'Direct'>('Mix');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [workshopDraft, setWorkshopDraft] = useState<string>('');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTweak = (text: string) => {
    setWorkshopDraft(text);
    // Smooth scroll down to Ask WingMan section
    const el = document.getElementById('ask-wingman-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Tone filtering
  const filteredOptions =
    selectedTone === 'Mix'
      ? analysis.replyOptions
      : analysis.replyOptions.filter(
          (opt) => opt.tone.toLowerCase() === selectedTone.toLowerCase()
        );

  // Interest percentage
  const interestPct = Math.min(100, Math.max(0, Math.round(analysis.interestScore)));
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (interestPct / 100) * circumference;

  return (
    <div className="space-y-5 sm:space-y-6 rise">
      {/* 1. Interest Ring Hero */}
      <div className="wm-card p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Circular Percentage Ring SVG */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-[#F1EFF6]"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Gradient Definition */}
              <defs>
                <linearGradient id="interestGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#B79CFF" />
                  <stop offset="100%" stopColor="#FF9AC4" />
                </linearGradient>
              </defs>
              {/* Animated Progress Ring */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#interestGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold text-[#14121B] leading-none">
                {interestPct}%
              </span>
              <span className="text-[10px] font-semibold text-[#8E88A0] uppercase tracking-wider mt-0.5">
                Interest
              </span>
            </div>
          </div>

          {/* Hero Details: "How it's going", "They seem: X", Match info */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5B5670]">
                How it's going
              </span>
              <span className="text-xs text-[#8E88A0]">•</span>
              <span className="text-xs font-semibold text-[#14121B]">
                {analysis.matchName} ({analysis.platform})
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F7F5FC] border border-[#E4E0F0] text-[#14121B]">
                They seem: <span className="text-[#B79CFF] capitalize">{analysis.vibe}</span>
              </span>
            </div>

            <p className="text-sm sm:text-base font-medium text-[#14121B] leading-relaxed">
              {analysis.subtextAnalysis}
            </p>

            <div className="pt-1 text-xs text-[#5B5670] flex items-center justify-center sm:justify-start gap-2 font-medium">
              <span>Verdict:</span>
              <span className="text-[#14121B] font-bold">{analysis.interestVerdict}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Green flags & Red flags Mini-Cards Side by Side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Green Flags Card */}
        <div className="wm-card p-4 sm:p-5 border-l-4 border-l-[#3CC38A]">
          <div className="flex items-center gap-2 mb-2.5">
            <ShieldCheck className="w-4 h-4 text-[#3CC38A]" />
            <h3 className="text-xs font-bold text-[#14121B] uppercase tracking-wider">
              Green flags
            </h3>
          </div>
          {analysis.whatsWorking && analysis.whatsWorking.length > 0 ? (
            <ul className="space-y-1.5 text-xs text-[#5B5670]">
              {analysis.whatsWorking.map((flag, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#3CC38A] font-bold shrink-0">✓</span>
                  <span className="leading-snug">{flag}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#8E88A0] italic">None spotted</p>
          )}
        </div>

        {/* Red Flags Card */}
        <div className="wm-card p-4 sm:p-5 border-l-4 border-l-[#F5A623]">
          <div className="flex items-center gap-2 mb-2.5">
            <AlertTriangle className="w-4 h-4 text-[#F5A623]" />
            <h3 className="text-xs font-bold text-[#14121B] uppercase tracking-wider">
              Red flags
            </h3>
          </div>
          {analysis.whatsFallingFlat && analysis.whatsFallingFlat.length > 0 ? (
            <ul className="space-y-1.5 text-xs text-[#5B5670]">
              {analysis.whatsFallingFlat.map((flag, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#F5A623] font-bold shrink-0">!</span>
                  <span className="leading-snug">{flag}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#8E88A0] italic">None spotted</p>
          )}
        </div>
      </div>

      {/* 3. Your next move Card */}
      <div className="wm-card p-4 sm:p-5 bg-gradient-to-r from-white to-[#F7F5FC]">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-[#B79CFF]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#14121B]">
            Your next move
          </h3>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-[#14121B] leading-relaxed">
          {analysis.dynamics?.interestSignals || analysis.interestVerdict || 'Keep the conversation low-pressure and playful, leading naturally toward an in-person hangout.'}
        </p>
      </div>

      {/* 4. Collapsed Transcript: "Show what we read" */}
      <div className="wm-card overflow-hidden">
        <button
          type="button"
          onClick={() => setShowTranscript(!showTranscript)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F7F5FC] transition-colors"
        >
          <span className="text-xs font-bold text-[#14121B]">
            Show what we read
          </span>
          <div className="flex items-center gap-1.5 text-xs text-[#5B5670]">
            <span>{analysis.transcript.length} lines</span>
            {showTranscript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showTranscript && (
          <div className="p-4 pt-0 border-t border-[#F1EFF6] space-y-2 bg-[#FAFAFE] animate-in fade-in duration-200">
            <div className="max-h-60 overflow-y-auto space-y-2 py-2 pr-1">
              {analysis.transcript.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id || idx}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[82%] px-3.5 py-2 rounded-[18px] text-xs leading-relaxed shadow-xs ${
                        isUser
                          ? 'bg-[#3B82F6] text-white rounded-br-xs'
                          : 'bg-[#F1EFF6] text-[#14121B] rounded-bl-xs border border-[#E4E0F0]'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`text-[9px] mt-1 block font-medium ${
                          isUser ? 'text-blue-100' : 'text-[#8E88A0]'
                        }`}
                      >
                        {isUser ? 'You' : analysis.matchName}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 5. ✨ AI generated replies */}
      <div className="wm-card p-5 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1EFF6] pb-3.5">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#14121B] tracking-tight flex items-center gap-1.5">
              <span>✨ AI generated replies</span>
            </h3>
          </div>

          {/* Tone Pills */}
          <div className="flex items-center gap-1 bg-[#F1EFF6] p-1 rounded-full self-start sm:self-auto">
            {(['Mix', 'Smooth', 'Funny', 'Direct'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTone(t)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedTone === t
                    ? 'bg-[#14121B] text-white shadow-xs'
                    : 'text-[#5B5670] hover:text-[#14121B]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Reply Cards */}
        <div className="space-y-3.5">
          {filteredOptions.map((option, index) => {
            const copyKey = `reply-${index}`;
            const isCopied = copiedId === copyKey;

            return (
              <div
                key={index}
                className="bg-[#F7F5FC] border border-[#E4E0F0] rounded-[18px] p-4 sm:p-5 space-y-3 hover:border-[#B79CFF] transition-all"
              >
                {/* Header: Tone tag & Copy button right */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-[#E4E0F0] text-[#14121B]">
                    {option.tone}
                  </span>

                  <div className="flex items-center gap-3">
                    {/* "Tweak" text link */}
                    <button
                      type="button"
                      onClick={() => handleTweak(option.replyText)}
                      className="text-xs font-semibold text-[#5B5670] hover:text-[#14121B] underline underline-offset-4 decoration-[#E4E0F0] hover:decoration-[#14121B] transition-colors"
                    >
                      Tweak
                    </button>

                    {/* Copy icon button right */}
                    <button
                      type="button"
                      onClick={() => handleCopy(option.replyText, copyKey)}
                      className="p-1.5 rounded-full bg-white hover:bg-[#F1EFF6] border border-[#E4E0F0] text-[#14121B] transition-all"
                      title="Copy reply to clipboard"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-[#3CC38A]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Reply Message text */}
                <p className="text-sm font-semibold text-[#14121B] leading-relaxed bg-white p-3.5 rounded-[14px] border border-[#E4E0F0]">
                  "{option.replyText}"
                </p>

                {/* Captions: "Why it works" & "Make it sound like you" */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B5670] block">
                      Why it works
                    </span>
                    <p className="text-[#5B5670] leading-snug">
                      {option.whyItWorks}
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B5670] block">
                      Make it sound like you
                    </span>
                    <p className="text-[#5B5670] leading-snug">
                      {option.howToAdapt}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ask WingMan (Workshop) with frozen context card on top */}
      <ReplyWorkshop
        analysis={analysis}
        initialDraft={workshopDraft}
        customInstructions={customInstructions}
        onOpenCustomInstructions={onOpenCustomInstructions}
      />
    </div>
  );
};

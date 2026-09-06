import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  Sparkles,
  Check,
  X,
  RotateCcw,
  CheckCircle2,
  Info,
  Zap,
} from 'lucide-react';

interface CustomInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructions: string;
  onSave: (newInstructions: string) => Promise<void>;
  isSaving: boolean;
}

const PRESET_STYLES = [
  {
    label: 'Concise & punchy',
    text: 'Keep responses concise and punchy, under 15 words. Avoid corporate jargon.',
  },
  {
    label: 'Dry wit & banter',
    text: 'Playful teasing and dry humor. Never use cheesy pickup lines or over-eager compliments.',
  },
  {
    label: 'Direct & date-focused',
    text: 'Be direct, confident, and smoothly transition banter into a low-pressure real-life date.',
  },
  {
    label: 'Casual lowercase',
    text: 'Casual lowercase tone, relaxed punctuation, friendly and effortless modern texting style.',
  },
];

export const CustomInstructionsModal: React.FC<CustomInstructionsModalProps> = ({
  isOpen,
  onClose,
  instructions,
  onSave,
  isSaving,
}) => {
  const [draft, setDraft] = useState(instructions);
  const [justApplied, setJustApplied] = useState(false);

  useEffect(() => {
    setDraft(instructions);
    setJustApplied(false);
  }, [instructions, isOpen]);

  if (!isOpen) return null;

  // The Apply button MUST be disabled by default and enabled only when entered/modified
  const hasChanges = draft.trim() !== instructions.trim();
  const isApplyDisabled = !hasChanges || isSaving;

  const handleApply = async () => {
    if (isApplyDisabled) return;
    try {
      await onSave(draft.trim());
      setJustApplied(true);
      setTimeout(() => {
        setJustApplied(false);
      }, 2500);
    } catch (err) {
      console.error('Failed to apply custom instructions:', err);
    }
  };

  const handleClear = () => {
    setDraft('');
  };

  const handleSelectPreset = (presetText: string) => {
    setDraft(presetText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white border border-[#E4E0F0] rounded-[24px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative text-[#14121B]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#F1EFF6] flex items-center justify-between relative z-10 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#B79CFF]/30 to-[#FF9AC4]/30 flex items-center justify-center text-[#14121B]">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#14121B] flex items-center gap-2">
                Custom Instructions
                {instructions.trim() && !hasChanges && (
                  <span className="text-[10px] font-semibold bg-[#3CC38A]/15 text-[#3CC38A] border border-[#3CC38A]/30 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#5B5670]">
                Tell WingMan your personal style or key situation details
              </p>
            </div>
          </div>

          <button
            id="custom-instructions-close-btn"
            onClick={onClose}
            className="p-2 rounded-full text-[#8E88A0] hover:text-[#14121B] hover:bg-[#F1EFF6] transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto no-scrollbar relative z-10 flex-1">
          {/* Status Alert Banner */}
          {justApplied && (
            <div className="bg-[#3CC38A]/15 border border-[#3CC38A]/30 text-[#14121B] text-xs rounded-2xl p-3 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#3CC38A] shrink-0" />
              <span className="font-semibold">Instructions saved! WingMan will craft all replies accordingly.</span>
            </div>
          )}

          {/* Quick preset chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#14121B] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B79CFF]" />
                Style Presets
              </span>
              <span className="text-[11px] text-[#8E88A0]">Tap to apply</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_STYLES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset.text)}
                  className="text-left text-xs bg-[#F7F5FC] hover:bg-[#F1EFF6] border border-[#E4E0F0] hover:border-[#B79CFF] rounded-2xl p-2.5 transition-all active:scale-[0.98]"
                >
                  <div className="font-semibold text-[#14121B]">
                    {preset.label}
                  </div>
                  <div className="text-[10px] text-[#5B5670] truncate mt-0.5">
                    {preset.text}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Input field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[#5B5670]">
              <label htmlFor="custom-instructions-input" className="font-bold text-[#14121B]">
                Your Instructions
              </label>
              <div className="flex items-center gap-2">
                <span>{draft.length} chars</span>
                {draft.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-[11px] text-[#8E88A0] hover:text-rose-500 transition-colors flex items-center gap-1 font-semibold"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            <textarea
              id="custom-instructions-input"
              rows={4}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Anything WingMan should know? e.g. keep it PG, she's a nurse, aim for Thursday"
              className="w-full bg-[#F7F5FC] border border-[#E4E0F0] focus:border-[#14121B] focus:bg-white rounded-2xl p-3.5 text-xs sm:text-sm text-[#14121B] placeholder:text-[#8E88A0] transition-all resize-none outline-none leading-relaxed"
            />
          </div>

          {/* Explanation note */}
          <div className="bg-[#F7F5FC] border border-[#E4E0F0] rounded-2xl p-3 flex items-start gap-2.5 text-xs text-[#5B5670]">
            <Info className="w-4 h-4 text-[#B79CFF] shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              WingMan respects your rules in every reply suggestion, vibe check, and coaching answer.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#F1EFF6] bg-white flex items-center justify-between gap-3 relative z-10">
          <div className="text-xs">
            {hasChanges ? (
              <span className="text-[#F5A623] flex items-center gap-1.5 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-pulse" />
                Unsaved changes
              </span>
            ) : instructions.trim() ? (
              <span className="text-[#3CC38A] flex items-center gap-1.5 font-semibold">
                <Check className="w-3.5 h-3.5" />
                Active
              </span>
            ) : (
              <span className="text-[#8E88A0]">No instructions set</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#5B5670] hover:text-[#14121B] hover:bg-[#F1EFF6] rounded-full transition-colors"
            >
              Cancel
            </button>

            {/* Apply button: Black pill, disabled by default, enabled only when entered/modified */}
            <button
              id="custom-instructions-apply-btn"
              type="button"
              onClick={handleApply}
              disabled={isApplyDisabled}
              className="wm-btn-primary px-5 py-2.5 text-xs flex items-center gap-1.5 shadow-sm"
            >
              {isSaving ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : justApplied ? (
                <Check className="w-3.5 h-3.5 text-[#3CC38A]" />
              ) : (
                <Zap className="w-3.5 h-3.5 text-amber-300" />
              )}
              <span>{justApplied ? 'Saved!' : 'Apply'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

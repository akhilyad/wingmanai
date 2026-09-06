import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Check,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Edit3,
} from 'lucide-react';

interface ConversationUploadProps {
  onAnalyzeImage: (base64: string, mimeType: string, userNote?: string) => Promise<void>;
  onAnalyzeText: (text: string, userNote?: string) => Promise<void>;
  onLoadPreset?: (result: any) => void;
  isLoading: boolean;
  customInstructions?: string;
  onOpenCustomInstructions?: () => void;
}

export const ConversationUpload: React.FC<ConversationUploadProps> = ({
  onAnalyzeImage,
  onAnalyzeText,
  isLoading,
  customInstructions = '',
  onOpenCustomInstructions,
}) => {
  const [selectedImage, setSelectedImage] = useState<{
    base64: string;
    name: string;
    mimeType: string;
  } | null>(null);
  const [entryMode, setEntryMode] = useState<'screenshot' | 'text'>('screenshot');
  const [showManualText, setShowManualText] = useState(false);
  const [customText, setCustomText] = useState('');
  const [userSide, setUserSide] = useState<'Right' | 'Left'>('Right');
  const [replyStyle, setReplyStyle] = useState<'Mix' | 'Smooth' | 'Funny' | 'Direct'>('Mix');
  const [showOptions, setShowOptions] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasContent = Boolean(selectedImage || customText.trim());
  const hasCustomInstructions = customInstructions.trim().length > 0;

  // Global paste handler (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          handleFile(file);
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setSelectedImage({
        base64,
        name: file.name,
        mimeType: file.type,
      });
      setShowOptions(true);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = () => {
    // Pack side and style into a user note so backend has full context
    const noteParts: string[] = [];
    if (userSide) noteParts.push(`My messages are on the ${userSide}`);
    if (replyStyle !== 'Mix') noteParts.push(`Target style: ${replyStyle}`);
    const finalNote = noteParts.join('. ');

    if (selectedImage) {
      onAnalyzeImage(selectedImage.base64, selectedImage.mimeType, finalNote);
    } else if (customText.trim()) {
      onAnalyzeText(customText.trim(), finalNote);
    }
  };

  return (
    <div className="wm-card p-5 sm:p-7 space-y-4">
      {/* Short headline */}
      <div className="text-center space-y-1 pb-1">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#14121B]">
          Upload a screenshot of a chat or bio
        </h2>
        <p className="text-xs text-[#5B5670]">
          WingMan reads the vibe, interest level, and writes your next moves
        </p>
      </div>

      {/* Segmented Mode Selector: Screenshot vs Enter Text */}
      <div className="flex items-center justify-center p-1 bg-[#F1EFF6] rounded-full max-w-xs mx-auto border border-[#E4E0F0]">
        <button
          type="button"
          onClick={() => setEntryMode('screenshot')}
          className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            entryMode === 'screenshot'
              ? 'bg-white text-[#14121B] shadow-xs'
              : 'text-[#5B5670] hover:text-[#14121B]'
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-[#B79CFF]" />
          <span>Screenshot</span>
        </button>
        <button
          type="button"
          onClick={() => setEntryMode('text')}
          className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            entryMode === 'text'
              ? 'bg-white text-[#14121B] shadow-xs'
              : 'text-[#5B5670] hover:text-[#14121B]'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5 text-[#B79CFF]" />
          <span>Enter Chat Text</span>
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* Mode 1: Screenshot Dropzone / Upload pill */}
      {entryMode === 'screenshot' && (
        !selectedImage ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`rounded-[20px] p-5 text-center transition-all border-2 border-dashed ${
              dragActive
                ? 'border-[#B79CFF] bg-[#F7F5FC]'
                : 'border-[#E4E0F0] bg-[#FAFAFE] hover:bg-[#F7F5FC]'
            }`}
          >
            {/* Full-width black pill "Upload a Screenshot" */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-12 wm-btn-primary flex items-center justify-center gap-2 text-sm shadow-sm active:scale-[0.99]"
            >
              <Upload className="w-4 h-4" />
              <span>Upload a Screenshot</span>
            </button>

            {/* Subtext: "Or paste (Ctrl+V)" */}
            <p className="text-xs text-[#8E88A0] font-medium mt-2.5">
              Or paste an image (Ctrl+V)
            </p>
          </div>
        ) : (
          /* Thumbnail strip when screenshot exists */
          <div className="bg-[#F7F5FC] border border-[#E4E0F0] rounded-[20px] p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={selectedImage.base64}
                alt="Uploaded screenshot"
                className="w-14 h-16 object-cover rounded-xl border border-[#E4E0F0] shrink-0 shadow-sm"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#14121B]">
                  <Check className="w-3.5 h-3.5 text-[#3CC38A]" />
                  <span className="truncate">Screenshot attached</span>
                </div>
                <p className="text-[11px] text-[#5B5670] truncate mt-0.5 max-w-[200px]">
                  {selectedImage.name}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="p-2 rounded-full hover:bg-white text-[#8E88A0] hover:text-[#14121B] transition-colors shrink-0"
              title="Remove screenshot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      )}

      {/* Mode 2: Direct Text Entry Area */}
      {entryMode === 'text' && (
        <div className="space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs px-1">
            <label htmlFor="conversation-text-input" className="font-bold text-[#14121B]">
              Enter conversation or match messages:
            </label>
            <span className="text-[10px] text-[#8E88A0]">
              Ctrl + Enter to analyze
            </span>
          </div>
          <textarea
            id="conversation-text-input"
            value={customText}
            onChange={(e) => {
              setCustomText(e.target.value);
              if (e.target.value.trim()) setShowOptions(true);
            }}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={`Paste or type conversation transcript here...\n\nExample:\nHer: Are you always this witty? 😂\nYou: Only when there's pizza involved.`}
            className="w-full h-32 bg-[#F7F5FC] border border-[#E4E0F0] focus:border-[#14121B] focus:bg-white rounded-[16px] p-3 text-xs text-[#14121B] placeholder:text-[#8E88A0] resize-none outline-none transition-all leading-relaxed shadow-inner"
          />
        </div>
      )}

      {/* Collapsible Options Row shown only after a screenshot or text is added */}
      {hasContent && (
        <div className="border border-[#E4E0F0] bg-[#F7F5FC] rounded-[16px] p-3.5 space-y-3 transition-all">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowOptions(!showOptions)}
          >
            <span className="text-xs font-bold text-[#14121B]">
              Chat Settings
            </span>
            <button
              type="button"
              className="text-[#5B5670] hover:text-[#14121B] text-xs font-medium flex items-center gap-1"
            >
              <span>{showOptions ? 'Hide' : 'Show'}</span>
              {showOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showOptions && (
            <div className="space-y-3 pt-1 border-t border-[#E4E0F0]/70 text-xs">
              {/* "My messages are on the" chips: Right / Left (default Right) */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-[#5B5670] font-medium">
                  My messages are on the:
                </span>
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-[#E4E0F0]">
                  {(['Right', 'Left'] as const).map((side) => (
                    <button
                      key={side}
                      type="button"
                      onClick={() => setUserSide(side)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        userSide === side
                          ? 'bg-[#14121B] text-white shadow-xs'
                          : 'text-[#5B5670] hover:text-[#14121B]'
                      }`}
                    >
                      {side}
                    </button>
                  ))}
                </div>
              </div>

              {/* "Reply style": Mix / Smooth / Funny / Direct */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-[#5B5670] font-medium">
                  Reply style:
                </span>
                <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-[#E4E0F0]">
                  {(['Mix', 'Smooth', 'Funny', 'Direct'] as const).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setReplyStyle(style)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                        replyStyle === style
                          ? 'bg-[#14121B] text-white shadow-xs'
                          : 'text-[#5B5670] hover:text-[#14121B]'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Primary Button Row with Custom Instructions Pill */}
      <div className="pt-2 space-y-2">
        <div className="flex items-center gap-2.5">
          {/* Primary button takes remaining width: "Get Replies ⚡" / "Thinking…" */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !hasContent}
            className="flex-1 h-12 wm-btn-primary flex items-center justify-center gap-2 text-sm shadow-md active:scale-[0.99]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Thinking…</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 font-bold">
                <span>Get Replies</span>
                <span className="text-[#FF9AC4]">⚡</span>
              </div>
            )}
          </button>

          {/* Secondary outlined pill "Custom Instructions" on the same row */}
          {onOpenCustomInstructions && (
            <button
              type="button"
              onClick={onOpenCustomInstructions}
              className={`h-12 px-4 rounded-full border text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 hover:bg-[#F7F5FC] ${
                hasCustomInstructions
                  ? 'border-[#B79CFF] text-[#14121B] bg-white shadow-xs'
                  : 'border-[#E4E0F0] text-[#5B5670] hover:text-[#14121B] bg-white'
              }`}
              title="Set your custom style or rules"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#14121B]" />
              <span className="hidden xs:inline sm:inline">Custom Instructions</span>
              <span className="xs:hidden sm:hidden">Custom</span>
              {hasCustomInstructions && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#3CC38A] ring-1 ring-white shrink-0 animate-pulse" />
              )}
            </button>
          )}
        </div>

        {/* Chip "Instructions on" under primary button when non-empty */}
        {hasCustomInstructions && (
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={onOpenCustomInstructions}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3CC38A]/10 border border-[#3CC38A]/25 text-[11px] font-semibold text-[#14121B] hover:bg-[#3CC38A]/15 transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#3CC38A] animate-pulse" />
              <span>Instructions on:</span>
              <span className="text-[#5B5670] truncate max-w-[200px] italic">
                "{customInstructions}"
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

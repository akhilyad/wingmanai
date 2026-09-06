import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Compass,
  Check,
  Copy,
  SlidersHorizontal,
} from 'lucide-react';
import { CoachMessage } from '../types';

interface StrategyCoachProps {
  customInstructions?: string;
  onOpenCustomInstructions?: () => void;
}

export const StrategyCoach: React.FC<StrategyCoachProps> = ({
  customInstructions = '',
  onOpenCustomInstructions,
}) => {
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: 'welcome',
      sender: 'coach',
      text: "Hey! I'm your WingMan dating coach. Texting anxiety and second-guessing happen when you try to calculate what they're thinking instead of leading with authentic confidence.\n\nWhether you're stuck after being left on read, figuring out how to propose drinks, or wondering if a tease was too subtle—ask away. What's the situation?",
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'How do I ask her out after 3 days of good banter?',
    'She gave a short response after 18 hours. How should I handle it?',
    'How do I tease playfully without sounding mean?',
    'What’s the best way to revive a chat that stalled last week?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMsg: CoachMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        text: m.text,
      }));

      const res = await fetch('/api/strategy-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history,
          customInstructions,
        }),
      });

      if (!res.ok) {
        throw new Error('Coach request failed');
      }

      const data = await res.json();
      const coachMsg: CoachMessage = {
        id: `c-${Date.now()}`,
        sender: 'coach',
        text: data.reply || "Let's look at that together. What did their last message say?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, coachMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `c-err-${Date.now()}`,
          sender: 'coach',
          text: "I hit a quick hiccup. Mind sending that again? Tell me what app you're on and what their last message was.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="wm-card p-5 sm:p-6 flex flex-col h-[640px] relative overflow-hidden">
      {/* Header */}
      <div className="pb-3.5 border-b border-[#F1EFF6] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#B79CFF]/30 to-[#FF9AC4]/30 flex items-center justify-center">
            <Compass className="w-5 h-5 text-[#14121B]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#14121B]">
              WingMan Strategy Coach
            </h3>
            <p className="text-xs text-[#5B5670]">
              Real-time advice on timing, tone, and setting up dates
            </p>
          </div>
        </div>

        {/* Custom Instructions link in Coach header */}
        {onOpenCustomInstructions && (
          <button
            type="button"
            onClick={onOpenCustomInstructions}
            className="text-xs font-semibold text-[#5B5670] hover:text-[#14121B] underline underline-offset-4 decoration-[#E4E0F0] hover:decoration-[#14121B] flex items-center gap-1 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#B79CFF]" />
            <span>Instructions</span>
            {customInstructions.trim() && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#3CC38A]" />
            )}
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1 no-scrollbar">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E88A0]">
                  {isUser ? 'You' : 'WingMan'}
                </span>
                <span className="text-[10px] text-[#8E88A0]">{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] rounded-[18px] p-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-line relative group shadow-xs ${
                  isUser
                    ? 'bg-[#3B82F6] text-white rounded-br-xs'
                    : 'bg-[#F1EFF6] text-[#14121B] rounded-bl-xs border border-[#E4E0F0]'
                }`}
              >
                {msg.text}

                {!isUser && (
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.text, msg.id)}
                    className="absolute bottom-2 right-2 p-1 rounded-md bg-white/80 hover:bg-white text-[#5B5670] opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy advice"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-[#3CC38A]" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="bg-[#F1EFF6] border border-[#E4E0F0] rounded-[18px] rounded-bl-xs p-3 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#8E88A0] typing-dot" />
              <div className="w-2 h-2 rounded-full bg-[#8E88A0] typing-dot" />
              <div className="w-2 h-2 rounded-full bg-[#8E88A0] typing-dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Starter Chips */}
      {messages.length <= 2 && (
        <div className="py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-[11px] bg-[#F7F5FC] hover:bg-[#F1EFF6] border border-[#E4E0F0] text-[#5B5670] hover:text-[#14121B] font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-all shrink-0 active:scale-98"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="pt-2 border-t border-[#F1EFF6] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask WingMan anything about your chat..."
          className="flex-1 bg-[#F7F5FC] border border-[#E4E0F0] focus:border-[#14121B] focus:bg-white rounded-full px-4 py-2.5 text-xs text-[#14121B] placeholder:text-[#8E88A0] outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="w-10 h-10 wm-btn-primary flex items-center justify-center shrink-0 shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

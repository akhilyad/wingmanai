export type ReplyTone = 'smooth' | 'funny' | 'direct';

export interface ChatBubble {
  id: string;
  sender: 'user' | 'match';
  text: string;
  timestamp?: string;
}

export interface ReplyOption {
  tone: ReplyTone;
  title: string;
  replyText: string;
  whyItWorks: string;
  howToAdapt: string;
  vibeBadge: string;
  blushFactor: number; // 1 to 5 stars or percentage
}

export interface AnalysisResult {
  matchName: string;
  platform: string;
  vibe: 'warm' | 'playful' | 'guarded' | 'eager' | 'testing' | string;
  interestScore: number; // 0-100
  interestVerdict: string;
  subtextAnalysis: string;
  whatsWorking: string[];
  whatsFallingFlat: string[];
  dynamics: {
    tone: string;
    pacing: string;
    interestSignals: string;
  };
  replyOptions: ReplyOption[];
  coachTip: string;
  transcript: ChatBubble[];
}

export interface WorkshopFeedback {
  draftMessage: string;
  authenticityScore: number; // 0-100
  energyType: 'genuine' | 'playful' | 'a_bit_try_hard' | 'stiff' | 'manipulative';
  genuineMoments: string[];
  tryHardAlerts: string[];
  verdictComment: string;
  refinedOptions: {
    title: string;
    message: string;
    explanation: string;
  }[];
}

export interface CoachMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  suggestedAction?: string;
  timestamp: string;
}

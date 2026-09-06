import { AnalysisResult } from '../types';

export const SAMPLE_KREE_RESULT: AnalysisResult = {
  matchName: 'Kree',
  platform: 'iMessage',
  vibe: 'playful',
  interestScore: 88,
  interestVerdict: 'High Interest & Receptive — Ready for Plans',
  subtextAnalysis: "Kree loved the bold dinner redirect. The winking emoji (😉) and acknowledging 'Smooth transition. I see what you did there!' means she caught the soft-flirt, appreciated the charm, and threw the conversational ball directly back into your court. She is waiting for you to lead the logistical details.",
  whatsWorking: [
    'Self-deprecating humor about the pasta fire broke the ice naturally',
    'Bold redirect to dinner was confident without being overly pushy',
    'She replied with laughing and winking emojis, matching your banter pace'
  ],
  whatsFallingFlat: [
    'Danger zone: Lingering in texting limbo. If you just reply with another generic joke or LOL, the momentum will dissolve'
  ],
  dynamics: {
    tone: 'Banterous, teasing, flirtatious with zero friction',
    pacing: 'Rapid engagement; she responded with playful energy immediately',
    interestSignals: 'Winking emoji, validating your confidence, explicitly encouraging the dinner invite'
  },
  replyOptions: [
    {
      tone: 'smooth',
      title: 'The Confident Host',
      replyText: "Only if you promise not to test my culinary skills until date number two. How does Italian this Thursday sound?",
      whyItWorks: "Validates her teasing, protects your ego with a smile, and smoothly transitions from playful banter directly to locking down a concrete date and day.",
      howToAdapt: "Swap 'Italian' for your favorite neighborhood spot or a drink place you actually love.",
      vibeBadge: 'Soft-Flirt & Close',
      blushFactor: 5
    },
    {
      tone: 'funny',
      title: 'The Safety Hazard',
      replyText: "I already hid the fire extinguisher. So do you prefer places with emergency exits, or can I pick a cute wine bar?",
      whyItWorks: "Keeps the running joke alive while demonstrating wit, then seamlessly slides in an easy low-pressure drink proposition.",
      howToAdapt: "You can replace 'cute wine bar' with tacos, tapas, or dessert.",
      vibeBadge: 'Witty & Charming',
      blushFactor: 4
    },
    {
      tone: 'direct',
      title: 'The Bold Lead',
      replyText: "Game recognizes game. Let’s do drinks this Friday so you can inspect my survival skills in person.",
      whyItWorks: "Leaves no room for ambiguity. Shows decisive masculine/confident initiative without being arrogant.",
      howToAdapt: "Change Friday to whichever day works best for your schedule.",
      vibeBadge: 'Decisive & Direct',
      blushFactor: 5
    }
  ],
  coachTip: "When a match confirms 'Smooth transition' with a wink, do NOT backtrack into small talk ('So what are you up to today?'). Close the loop with a day and a place!",
  transcript: [
    { id: '1', sender: 'user', text: "I just tried to cook pasta and accidentally set the water on fire. 🍝🔥" },
    { id: '2', sender: 'match', text: "How is that even scientifically possible?! 😂" },
    { id: '3', sender: 'user', text: "I don't know, but it's a sign that I should probably just let you take me out for dinner instead." },
    { id: '4', sender: 'match', text: "Smooth transition. I see what you did there! 😉" }
  ]
};

export const SAMPLE_HINGE_CHAT = `Match (Maya): Love the hiking photo! Where was that taken?
You: That was Mount Tamalpais! Almost lost my shoe on the ridge though. Are you into trails or more of a walk-to-a-bakery person?
Match (Maya): 1000% bakery person haha. If pastries aren't involved at the summit, why are we climbing?`;

export const SAMPLE_BUMBLE_CHAT = `Match (Chloe): Hey! Your dog looks like he has more personality than most people in this city haha 🐕
You: You're not wrong, he routinely negotiates his bedtime. But don't let him hear that, his ego is already unmanageable.
Match (Chloe): Haha please tell me he has his own raincoat too?`;

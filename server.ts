import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Persistent Storage for User Custom Instructions
const DATA_DIR = path.join(process.cwd(), "data");
const INSTRUCTIONS_FILE = path.join(DATA_DIR, "custom_instructions.json");

let memoryCustomInstructions: string = "";

function loadCustomInstructions(): string {
  try {
    if (fs.existsSync(INSTRUCTIONS_FILE)) {
      const raw = fs.readFileSync(INSTRUCTIONS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (typeof parsed.instructions === "string") {
        memoryCustomInstructions = parsed.instructions;
        return memoryCustomInstructions;
      }
    }
  } catch (err) {
    console.error("Failed to read custom instructions file:", err);
  }
  return memoryCustomInstructions;
}

function saveCustomInstructions(instructions: string): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    memoryCustomInstructions = instructions;
    fs.writeFileSync(
      INSTRUCTIONS_FILE,
      JSON.stringify({ instructions, updatedAt: new Date().toISOString() }, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.error("Failed to save custom instructions file:", err);
  }
}

// Initialize on boot
loadCustomInstructions();

function getEffectiveInstructions(reqCustom?: string): string {
  if (typeof reqCustom === "string" && reqCustom.trim().length > 0) {
    return reqCustom.trim();
  }
  return loadCustomInstructions().trim();
}

function buildSystemInstruction(basePrompt: string, customInstructions?: string): string {
  const effective = getEffectiveInstructions(customInstructions);
  if (!effective) {
    return basePrompt;
  }
  return `${basePrompt}

═══════════════════════════════════════════════════════════════
USER CUSTOM INSTRUCTIONS & STYLE PREFERENCES (MANDATORY OVERRIDE):
The user has specified explicit formatting and style instructions that MUST be strictly applied to every response, analysis, and generated reply:
"${effective}"

CRITICAL ENFORCEMENT:
- Format and style all suggested replies, advice, explanations, and coaching to align with these instructions.
- If the user asked for concise, witty, punchy, or conversational replies, never produce long-winded, stiff, or corporate outputs.
- Ensure every single generated reply option reflects the user's requested voice, tone, and formatting constraints.
═══════════════════════════════════════════════════════════════`;
}

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const RIZZ_SYSTEM_PROMPT = `You are Rizzz, an elite dating conversation analyst and reply wingman coach.
Your expertise is helping users overcome texting anxiety and writer's block by analyzing real dating conversations, reading what's actually happening beneath the surface, and coaching them to craft replies that feel genuine, land with impact, and move interactions toward real connection.

CORE RULES FOR SCREENSHOTS & TRANSCRIPTS:
- The user seeking coaching is the sender on the RIGHT side of the chat (e.g. blue bubbles in iMessage, right-aligned bubbles in Tinder, Bumble, Hinge, Instagram, WhatsApp).
- The match is on the LEFT side (e.g. black/dark/grey bubbles on the left).
- You teach users to write better messages themselves—not by writing robotic pickup lines, but by coaching them on what works, why it works, and how to adapt it to their own voice.

WHEN ANALYZING A CONVERSATION:
1. Identify the vibe the match is giving: warm, playful, guarded, eager, or testing.
2. Read the subtext: what's actually happening beneath the surface.
3. Calculate an Interest Score (0 to 100) based on response speed, emojis, questions asked, banter reciprocity, enthusiasm, and validation.
4. Point out what's working and what's falling flat in the current exchange.
5. Generate 3 concrete reply options that land as "soft-flirts"—replies that make the other person smile and blush, balancing playfulness with genuine warmth:
   - "smooth": confident, charming, builds on rapport.
   - "funny": witty, playful, shows personality.
   - "direct": forward, moves toward a date/meeting up, zero ambiguity.
6. For each reply option, provide:
   - The reply text
   - "whyItWorks": the psychological/social dynamic and why it builds attraction
   - "howToAdapt": tips on tweaking it into the user's authentic voice
   - A descriptive "vibeBadge" (e.g., "Soft-Flirt & Close", "Playful Tease", "Decisive Lead")
   - A "blushFactor" rating (1 to 5)

CRITICAL BOUNDARIES:
- Never suggest manipulative tactics, deceit, or negging. Redirect toward genuine connection.
- Never lose momentum: suggestions should move toward a real date or deeper connection, not stay trapped in endless small talk.
- Never give generic, repetitive replies. Suggestions must be deeply tailored to the exact context, jokes, and vibe.
- Be conversational, relatable, and encouraging.`;

// Schema for Analysis Result
const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    matchName: { type: Type.STRING, description: "Name of the match or 'Match' if unspecified" },
    platform: { type: Type.STRING, description: "Platform detected, e.g. iMessage, Hinge, Bumble, Tinder, Instagram" },
    vibe: { type: Type.STRING, description: "Vibe tag: warm, playful, guarded, eager, or testing" },
    interestScore: { type: Type.INTEGER, description: "Score from 0 to 100" },
    interestVerdict: { type: Type.STRING, description: "Punchy summary of interest level and readiness" },
    subtextAnalysis: { type: Type.STRING, description: "What is actually happening beneath the surface in 2-3 sentences" },
    whatsWorking: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2-3 specific things that landed well or showed good chemistry"
    },
    whatsFallingFlat: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "1-2 hazards, stalling points, or things to watch out for"
    },
    dynamics: {
      type: Type.OBJECT,
      properties: {
        tone: { type: Type.STRING, description: "Tone overview" },
        pacing: { type: Type.STRING, description: "Pacing dynamic" },
        interestSignals: { type: Type.STRING, description: "Key interest signals or red/green flags observed" }
      },
      required: ["tone", "pacing", "interestSignals"]
    },
    replyOptions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tone: { type: Type.STRING, description: "Must be 'smooth', 'funny', or 'direct'" },
          title: { type: Type.STRING, description: "Creative title for the move" },
          replyText: { type: Type.STRING, description: "The exact reply suggestion" },
          whyItWorks: { type: Type.STRING, description: "Psychological reason why it lands" },
          howToAdapt: { type: Type.STRING, description: "How the user can adapt to their style" },
          vibeBadge: { type: Type.STRING, description: "Tag like Soft-Flirt, Playful Tease, etc." },
          blushFactor: { type: Type.INTEGER, description: "1 to 5" }
        },
        required: ["tone", "title", "replyText", "whyItWorks", "howToAdapt", "vibeBadge", "blushFactor"]
      }
    },
    coachTip: { type: Type.STRING, description: "One golden piece of wingman advice for this exact situation" },
    transcript: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          sender: { type: Type.STRING, description: "user or match" },
          text: { type: Type.STRING }
        },
        required: ["id", "sender", "text"]
      },
      description: "Extracted chat bubbles in chronological order"
    }
  },
  required: [
    "matchName", "platform", "vibe", "interestScore", "interestVerdict",
    "subtextAnalysis", "whatsWorking", "whatsFallingFlat", "dynamics",
    "replyOptions", "coachTip", "transcript"
  ]
};

// Model hierarchy: Use gemini-3.8-flash as primary (standard for text & multimodal),
// with graceful fallback to gemini-3.1-flash-lite and gemini-flash-latest.
const RELIABLE_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
];

async function generateWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
    preferredModels?: string[];
  }
): Promise<string> {
  const models = params.preferredModels && params.preferredModels.length > 0
    ? params.preferredModels
    : RELIABLE_MODELS;

  let lastError: any = null;

  for (const model of models) {
    // Try up to 2 times for transient errors (503 spike, 429 rate limit)
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(`Generating with Gemini model: ${model} (attempt ${attempt + 1})`);
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });

        const text = response.text;
        if (text && text.trim().length > 0) {
          return text;
        }
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || String(err);
        console.warn(`Model ${model} attempt ${attempt + 1} failed: ${msg.slice(0, 150)}`);

        // If it's a 503 (high demand) or 429 (rate limit), wait briefly before retrying
        const isTransient = msg.includes("503") || msg.includes("high demand") || msg.includes("429");
        if (isTransient && attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
        // Otherwise switch to next model immediately
        break;
      }
    }
  }

  throw new Error(
    lastError?.message || "Service is currently experiencing high demand. Please try again in a few moments."
  );
}

function safeParseJson<T = any>(text: string): T {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?\s*```$/, "").trim();
  }
  return JSON.parse(cleaned);
}

// 1. Analyze Image Endpoint (Uses gemini-3.8-flash primary with reliable fallback, supports multiple screenshots)
app.post("/api/analyze-image", async (req: Request, res: Response): Promise<void> => {
  try {
    const { images, imageBase64, mimeType = "image/png", userNote, customInstructions } = req.body;
    
    // Normalize to array of image items
    const rawImages: Array<{ imageBase64: string; mimeType?: string; name?: string }> = [];
    if (Array.isArray(images) && images.length > 0) {
      rawImages.push(...images);
    } else if (imageBase64) {
      rawImages.push({ imageBase64, mimeType });
    }

    if (rawImages.length === 0) {
      res.status(400).json({ error: "Missing image data" });
      return;
    }

    const ai = getGeminiClient();
    const effectiveInstructions = getEffectiveInstructions(customInstructions);
    const count = rawImages.length;

    let promptText = count > 1
      ? `Analyze these ${count} dating conversation screenshots presented in chronological sequence (Screenshot 1, Screenshot 2, etc.).
Carefully read across all screenshots as one connected conversation exchange from earliest to latest.
Remember:
- The user is the sender on the RIGHT (in the screenshot, blue or sent chat bubbles).
- The match is on the LEFT (black/dark/grey received bubbles).
${userNote ? `Additional context from user: "${userNote}"` : ""}`
      : `Analyze this dating conversation screenshot.
Remember:
- The user is the sender on the RIGHT (in the screenshot, blue chat bubbles).
- The match is on the LEFT (black/dark bubbles).
${userNote ? `Additional context from user: "${userNote}"` : ""}`;

    if (effectiveInstructions) {
      promptText += `\n\nUSER CUSTOM INSTRUCTIONS & STYLE PREFERENCES TO APPLY:\n"${effectiveInstructions}"\nEnsure the vibe interpretation and all 3 reply options adhere strictly to these custom instructions.`;
    }

    promptText += `\n\nRead beneath the surface, analyze the interest level, explain what's working vs. stalling across the chat, and generate 3 soft-flirt reply options (Smooth, Funny, Direct) that make the match smile and blush, advancing the conversation toward a date. Output pure structured JSON matching the schema.`;

    const imageParts = rawImages.map((img, idx) => {
      const cleanData = img.imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");
      return {
        inlineData: {
          mimeType: img.mimeType || "image/png",
          data: cleanData,
        },
      };
    });

    const systemInstruction = buildSystemInstruction(RIZZ_SYSTEM_PROMPT, customInstructions);

    const rawText = await generateWithFallback(ai, {
      contents: {
        parts: [...imageParts, { text: promptText }],
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
      },
    });

    const parsed = safeParseJson(rawText);
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/analyze-image:", error);
    const clientMessage = error.message?.includes("503") || error.message?.includes("high demand")
      ? "AI model is currently experiencing high demand. Please try again in a few moments."
      : error.message || "Failed to analyze image";
    res.status(500).json({ error: clientMessage });
  }
});

// 2. Analyze Text / Manual Transcript Endpoint
app.post("/api/analyze-text", async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversationText, userNote, customInstructions } = req.body;
    if (!conversationText) {
      res.status(400).json({ error: "Missing conversation text" });
      return;
    }

    const ai = getGeminiClient();
    const effectiveInstructions = getEffectiveInstructions(customInstructions);

    let promptText = `Analyze this text conversation exchange:
"""
${conversationText}
"""
${userNote ? `User context: "${userNote}"` : ""}`;

    if (effectiveInstructions) {
      promptText += `\n\nUSER CUSTOM INSTRUCTIONS & STYLE PREFERENCES TO APPLY:\n"${effectiveInstructions}"\nEnsure the vibe analysis and all 3 generated reply options adhere strictly to these custom instructions.`;
    }

    promptText += `\n\nRead beneath the surface, identify the other person's vibe, calculate interest score, note what is working vs. stalling, and generate 3 soft-flirt reply options (Smooth, Funny, Direct) that advance the conversation toward meeting up.`;

    const systemInstruction = buildSystemInstruction(RIZZ_SYSTEM_PROMPT, customInstructions);

    const rawText = await generateWithFallback(ai, {
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
      },
    });

    const parsed = safeParseJson(rawText);
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/analyze-text:", error);
    const clientMessage = error.message?.includes("503") || error.message?.includes("high demand")
      ? "AI model is currently experiencing high demand. Please try again in a few moments."
      : error.message || "Failed to analyze conversation text";
    res.status(500).json({ error: clientMessage });
  }
});

// 3. Workshop a Reply Endpoint (Vibe check user's draft)
app.post("/api/workshop-reply", async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversationContext, draftReply, customInstructions } = req.body;
    if (!draftReply) {
      res.status(400).json({ error: "Missing draft reply" });
      return;
    }

    const ai = getGeminiClient();
    const effectiveInstructions = getEffectiveInstructions(customInstructions);

    let prompt = `The user is workshopping a message they drafted to send to their match.
Conversation context:
"""
${conversationContext || "General dating conversation"}
"""

User's Draft Reply:
"""
${draftReply}
"""`;

    if (effectiveInstructions) {
      prompt += `\n\nUSER CUSTOM INSTRUCTIONS & STYLE PREFERENCES TO APPLY:\n"${effectiveInstructions}"\nCritique the draft and format the refined variation options according to these custom instructions.`;
    }

    prompt += `\n\nEvaluate this draft message honestly as an authentic wingman mentor:
- Point out genuine moments vs. forced, try-hard, or overly eager energy.
- Flag if anything reads as manipulative, game-playing, or inauthentic, and redirect toward honest connection.
- Score authenticity from 0 to 100.
- Provide 2-3 refined variations that preserve the user's authentic voice while making it land with more natural charm, confidence, and flirtatious warmth.`;

    const WORKSHOP_SCHEMA = {
      type: Type.OBJECT,
      properties: {
        draftMessage: { type: Type.STRING },
        authenticityScore: { type: Type.INTEGER },
        energyType: {
          type: Type.STRING,
          description: "One of: genuine, playful, a_bit_try_hard, stiff, manipulative"
        },
        genuineMoments: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Things in the draft that felt real, authentic, or likeable"
        },
        tryHardAlerts: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Things that felt forced, unneeded, overthinking, or risky"
        },
        verdictComment: { type: Type.STRING, description: "Wingman summary feedback" },
        refinedOptions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              message: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["title", "message", "explanation"]
          }
        }
      },
      required: ["draftMessage", "authenticityScore", "energyType", "genuineMoments", "tryHardAlerts", "verdictComment", "refinedOptions"]
    };

    const systemInstruction = buildSystemInstruction(RIZZ_SYSTEM_PROMPT, customInstructions);

    const rawText = await generateWithFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: WORKSHOP_SCHEMA,
      },
    });

    const parsed = safeParseJson(rawText);
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/workshop-reply:", error);
    const clientMessage = error.message?.includes("503") || error.message?.includes("high demand")
      ? "AI model is currently experiencing high demand. Please try again in a few moments."
      : error.message || "Failed to workshop reply";
    res.status(500).json({ error: clientMessage });
  }
});

// 4. Dating Strategy Coach Chat Endpoint
app.post("/api/strategy-coach", async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history = [], customInstructions } = req.body;
    if (!message) {
      res.status(400).json({ error: "Missing message" });
      return;
    }

    const ai = getGeminiClient();

    // Format contents with history
    const contents: any[] = [];
    for (const h of history) {
      contents.push({
        role: h.role === "assistant" ? "model" : "user",
        parts: [{ text: h.text }],
      });
    }
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const baseCoachPrompt = `${RIZZ_SYSTEM_PROMPT}

You are in direct Strategy & Coaching Mode.
When the user asks about dating strategy or gets stuck:
- Ask clarifying questions about context, desired outcome, and the dynamic at play.
- Offer concrete approaches with clear trade-offs.
- Explain the psychology or social dynamic so they see the 'why' behind the advice.
- Adapt energy: Witty and playful with nervous users to build confidence; direct and encouraging with confident ones.
- Never give generic platitudes like "just be yourself"—give specific actionable communication moves grounded in honesty and confidence.
- Keep answers concise, high-impact, easy to read, and formatted with crisp bullet points when explaining moves.`;

    const finalCoachPrompt = buildSystemInstruction(baseCoachPrompt, customInstructions);

    const reply = await generateWithFallback(ai, {
      contents,
      config: {
        systemInstruction: finalCoachPrompt,
      },
    });

    res.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/strategy-coach:", error);
    const clientMessage = error.message?.includes("503") || error.message?.includes("high demand")
      ? "AI model is currently experiencing high demand. Please try again in a few moments."
      : error.message || "Failed to get strategy advice";
    res.status(500).json({ error: clientMessage });
  }
});

// 5. Custom Instructions Persistent API Endpoints
app.get("/api/custom-instructions", (_req: Request, res: Response): void => {
  try {
    const instructions = loadCustomInstructions();
    res.json({ instructions });
  } catch (err: any) {
    console.error("Error in GET /api/custom-instructions:", err);
    res.status(500).json({ error: "Failed to retrieve custom instructions" });
  }
});

app.post("/api/custom-instructions", (req: Request, res: Response): void => {
  try {
    const { instructions } = req.body;
    if (typeof instructions !== "string") {
      res.status(400).json({ error: "Instructions must be a string" });
      return;
    }
    const cleanInstructions = instructions.trim();
    saveCustomInstructions(cleanInstructions);
    res.json({ success: true, instructions: cleanInstructions });
  } catch (err: any) {
    console.error("Error in POST /api/custom-instructions:", err);
    res.status(500).json({ error: "Failed to save custom instructions" });
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Rizzz" });
});

// Serve public static assets (PWA manifest, icons, service worker, assetlinks)
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/.well-known/assetlinks.json", (_req, res) => {
  res.type("application/json");
  res.sendFile(path.join(process.cwd(), "public", ".well-known", "assetlinks.json"));
});

app.get("/manifest.webmanifest", (_req, res) => {
  res.type("application/manifest+json");
  res.sendFile(path.join(process.cwd(), "public", "manifest.webmanifest"));
});

// Vite middleware configuration for development & static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Rizzz server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

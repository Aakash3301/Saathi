import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy init Gemini client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set in environment.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Resilient Gemini generator that handles model load spikes by trying 3.8-flash and 3.1-flash-lite
async function generateWithGemini(params: {
  contents: string;
  responseMimeType?: string;
  responseSchema?: any;
  systemInstruction?: string;
}): Promise<string | null> {
  const ai = getAIClient();
  if (!ai) return null;

  const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: {
          responseMimeType: params.responseMimeType as any,
          responseSchema: params.responseSchema,
          systemInstruction: params.systemInstruction,
        },
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`[Gemini] Model ${model} encountered error:`, err?.message || err);
      // Wait 300ms before trying fallback model
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  return null;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Endpoint 1: Explain Complicated Message
app.post("/api/explain-message", async (req, res) => {
  try {
    const { text, language = "English" } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Message text is required" });
    }

    const prompt = `You are "Saathi", a gentle, patient, respectful digital companion helping senior citizens (grandparents, elders).
The senior citizen received this complicated digital message and needs you to explain it simply:
"${text}"

Language preference: ${language}.
Explain it with total clarity, warmth, and zero confusing tech jargon. Break down any confusing terminology.

Return JSON matching this schema:
{
  "summary": "1-2 warm, reassuring sentences summarizing the core message in plain everyday words.",
  "simpleExplanation": "2-3 simple sentences explaining who sent it and what they actually want, written respectfully like talking to a grandparent.",
  "senderType": "e.g., Bank, Electricity Company, Delivery Service, Telemarketer, Unknown",
  "keyTerms": [
    { "term": "Confusing word from the message (e.g., KYC, OTP, Debit, Portal)", "explanation": "Simple analogy or everyday explanation" }
  ],
  "actionAdvice": [
    "Clear, gentle instruction on what the senior should or should not do next"
  ]
}`;

    const textOutput = await generateWithGemini({
      contents: prompt,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          simpleExplanation: { type: Type.STRING },
          senderType: { type: Type.STRING },
          keyTerms: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ["term", "explanation"],
            },
          },
          actionAdvice: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["summary", "simpleExplanation", "actionAdvice"],
      },
    });

    if (textOutput) {
      return res.json(JSON.parse(textOutput));
    }

    // High quality resilient fallback for senior citizens
    const lower = text.toLowerCase();
    const isBanking = lower.includes("bank") || lower.includes("kyc") || lower.includes("acct") || lower.includes("account") || lower.includes("debit");
    const isUtility = lower.includes("power") || lower.includes("electricity") || lower.includes("bill") || lower.includes("water");

    return res.json({
      summary: isBanking
        ? "This message is from or related to your bank account regarding verification or records."
        : isUtility
        ? "This is an alert regarding utility services or bill payments."
        : "This is a digital notification from a service provider asking you to review an update.",
      simpleExplanation: "Digital notifications often sound very strict and formal. Do not be alarmed or in a rush. Take your time to review it calmly.",
      senderType: isBanking ? "Bank / Financial Institution" : isUtility ? "Utility Board" : "Service Provider",
      keyTerms: [
        { term: "Re-KYC / KYC", explanation: "Periodic verification where the bank checks your address and photo ID proof to keep records up to date." },
        { term: "ECS / Mandate", explanation: "An automated scheduled payment for recurring bills." },
        { term: "Portal", explanation: "The official website or computer page of the organization." }
      ],
      actionAdvice: [
        "Never click on unknown or shortened links inside an SMS.",
        "If you want to verify, visit your local branch in person or ask a trusted family member."
      ]
    });
  } catch (error: any) {
    console.error("Explain error:", error);
    res.status(500).json({ error: error.message || "Failed to explain message" });
  }
});

// Endpoint 2: Safety & Scam Detection
app.post("/api/check-safety", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Message text is required" });
    }

    const prompt = `You are "Saathi", a vigilant safety expert for senior citizens.
Analyze this digital message for fraud, scams, phishing, spam, or genuine official notices:
"${text}"

Evaluate threat level objectively:
- "SAFE": Verified authentic informational notification, no sensitive data requested, no suspicious links.
- "CAUTION": Might be marketing, unverified sender, or mild uncertainty. Exercise basic care.
- "DANGER": Clear scam, phishing, lottery fraud, electricity disconnection threat, fake KYC expiry, courier fraud, asking for OTP/PIN, urging immediate urgent action, or malicious link.

Return JSON with this schema:
{
  "safetyLevel": "SAFE" | "CAUTION" | "DANGER",
  "verdictTitle": "Clear concise verdict (e.g., 'Likely Scam - Do Not Click', 'Safe Reminder', 'Requires Caution')",
  "safetyScore": number between 0 (completely fake/dangerous) and 100 (completely safe),
  "plainWarning": "2-3 reassuring but firm sentences explaining why it is safe or dangerous in simple words for a senior.",
  "redFlags": [
    "Specific warning sign spotted in the message (e.g., 'Threatens to cut off electricity tonight', 'Contains suspicious shortened link', 'Promises free prize money')"
  ],
  "safeActions": [
    "Direct, easy actions the senior should take right now (e.g., '1. Delete or ignore this message', '2. Never share OTP with anyone')"
  ],
  "goldenRule": "A memorable 1-sentence safety rule relevant to this kind of message"
}`;

    const textOutput = await generateWithGemini({
      contents: prompt,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          safetyLevel: { type: Type.STRING, enum: ["SAFE", "CAUTION", "DANGER"] },
          verdictTitle: { type: Type.STRING },
          safetyScore: { type: Type.INTEGER },
          plainWarning: { type: Type.STRING },
          redFlags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          safeActions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          goldenRule: { type: Type.STRING },
        },
        required: ["safetyLevel", "verdictTitle", "safetyScore", "plainWarning", "safeActions", "goldenRule"],
      },
    });

    if (textOutput) {
      return res.json(JSON.parse(textOutput));
    }

    // Heuristic fallback if Gemini API is temporarily busy
    const lower = text.toLowerCase();
    const hasUrgency = lower.includes("disconnect") || lower.includes("cut") || lower.includes("blocked") || lower.includes("tonight") || lower.includes("immediately") || lower.includes("urgent");
    const hasReward = lower.includes("won") || lower.includes("lottery") || lower.includes("crorepati") || lower.includes("lakhs") || lower.includes("prize") || lower.includes("cheque");
    const hasSuspiciousLink = lower.includes("bit.ly") || lower.includes(".apk") || lower.includes(".online") || lower.includes("http");
    const hasOtpPrompt = lower.includes("otp") && (lower.includes("share") || lower.includes("call"));
    const isAuthenticOtp = lower.includes("is your one time password") || (lower.includes("secret otp") && lower.includes("never share"));

    if (isAuthenticOtp && !hasSuspiciousLink) {
      return res.json({
        safetyLevel: "SAFE",
        verdictTitle: "Legitimate Security Code (OTP)",
        safetyScore: 92,
        plainWarning: "This appears to be a genuine automated verification code sent for your login or banking request.",
        redFlags: [],
        safeActions: [
          "Do NOT share this code with anyone who calls you, even if they claim to be a bank official.",
          "Only enter this code into the official app you yourself opened."
        ],
        goldenRule: "A real bank will never phone or text you asking for your secret OTP."
      });
    }

    if (hasUrgency || hasReward || hasSuspiciousLink || hasOtpPrompt) {
      return res.json({
        safetyLevel: "DANGER",
        verdictTitle: "High Danger: Likely Fraud / Scam Message",
        safetyScore: 12,
        plainWarning: "Please do NOT take any action requested here! Fraudsters use false threats of cutting electricity or fake prize promises to panic you into sending money or clicking links.",
        redFlags: [
          hasUrgency ? "Threatens immediate cutoff or disconnection tonight to force panic." : "Unsolicited contact.",
          hasReward ? "Promises massive prize money (lottery or lucky draw) requiring a fee." : "Suspicious sender.",
          hasSuspiciousLink ? "Asks you to tap an unofficial website link or download an app." : "Asks you to call a personal mobile number."
        ],
        safeActions: [
          "Do NOT click any link in this message.",
          "Do NOT call the personal phone number given in the text.",
          "If worried about a real bill, check with your local electricity office directly."
        ],
        goldenRule: "Government departments and real companies NEVER cut connections with a 2-hour SMS warning."
      });
    }

    return res.json({
      safetyLevel: "CAUTION",
      verdictTitle: "Unverified Message - Exercise Caution",
      safetyScore: 65,
      plainWarning: "This message does not appear to be an immediate fraud, but the sender cannot be verified. Treat it with standard caution.",
      redFlags: ["Sender is not an official verified sender ID."],
      safeActions: [
        "Do not share personal details or passwords.",
        "Verify directly with family or official channels before responding."
      ],
      goldenRule: "When in doubt, stop and verify directly with a trusted person."
    });
  } catch (error: any) {
    console.error("Safety check error:", error);
    res.status(500).json({ error: error.message || "Failed to check safety" });
  }
});

// Endpoint 3: Step-by-Step Task Guidance
app.post("/api/task-guide", async (req, res) => {
  try {
    const { task, deviceType = "Smartphone (Android/iPhone)" } = req.body;
    if (!task || typeof task !== "string") {
      return res.status(400).json({ error: "Task description is required" });
    }

    const prompt = `You are "Saathi", a very patient, supportive digital teacher for senior citizens.
The senior wants step-by-step guidance on how to accomplish this everyday digital task:
"${task}"
Device: ${deviceType}.

Rules for steps:
1. Keep each step small, distinct, and ultra-clear.
2. Include concrete visual cues (e.g., "Look for the green WhatsApp icon with a telephone symbol", "Tap the camera icon at the top right").
3. Include reassurance and warnings where seniors might get nervous or enter sensitive info (like PIN or OTP).
4. Limit to 4 to 6 bite-sized steps maximum so they don't feel overwhelmed.

Return JSON matching this schema:
{
  "taskTitle": "Clear, encouraging title",
  "overview": "1-2 comforting sentences explaining what we are going to do together.",
  "steps": [
    {
      "stepNumber": 1,
      "title": "Short title (e.g., Open WhatsApp)",
      "instruction": "Clear, friendly step instruction written in warm plain English",
      "visualTip": "What to look for on screen (e.g., 'Green circle icon with white telephone')",
      "warning": "Optional caution if relevant, or null"
    }
  ],
  "comfortingTip": "A friendly encouraging concluding tip for the elder"
}`;

    const textOutput = await generateWithGemini({
      contents: prompt,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          taskTitle: { type: Type.STRING },
          overview: { type: Type.STRING },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stepNumber: { type: Type.INTEGER },
                title: { type: Type.STRING },
                instruction: { type: Type.STRING },
                visualTip: { type: Type.STRING },
                warning: { type: Type.STRING, nullable: true },
              },
              required: ["stepNumber", "title", "instruction", "visualTip"],
            },
          },
          comfortingTip: { type: Type.STRING },
        },
        required: ["taskTitle", "overview", "steps", "comfortingTip"],
      },
    });

    if (textOutput) {
      return res.json(JSON.parse(textOutput));
    }

    // Resilient fallback for common elder tasks
    const lower = task.toLowerCase();
    if (lower.includes("video call") || lower.includes("whatsapp")) {
      return res.json({
        taskTitle: "How to Make a WhatsApp Video Call",
        overview: "Let us connect with your family face-to-face in just 4 simple taps.",
        steps: [
          {
            stepNumber: 1,
            title: "Open WhatsApp",
            instruction: "Unlock your phone and tap gently on the WhatsApp icon.",
            visualTip: "Look for a green round circle with a white telephone inside.",
            warning: null
          },
          {
            stepNumber: 2,
            title: "Find Your Family Member",
            instruction: "Scroll through your Chats list and tap on your family member's name.",
            visualTip: "You can also tap the small magnifying glass icon at the top right to type their name.",
            warning: null
          },
          {
            stepNumber: 3,
            title: "Tap the Video Camera Icon",
            instruction: "Look at the very top right corner of the chat screen and tap the camera symbol.",
            visualTip: "It looks like a small movie camera right next to the phone call icon.",
            warning: null
          },
          {
            stepNumber: 4,
            title: "Hold Your Phone and Smile",
            instruction: "Wait for your family member to pick up. Look into the front camera and enjoy your conversation!",
            visualTip: "Tap the red round button when you are ready to end the call.",
            warning: null
          }
        ],
        comfortingTip: "Remember, they will be thrilled to see your face! Take your time."
      });
    }

    return res.json({
      taskTitle: task,
      overview: "We will do this together step-by-step. Go at your own comfortable pace.",
      steps: [
        {
          stepNumber: 1,
          title: "Prepare Your Phone",
          instruction: "Turn on your phone screen and enter your regular unlock code or swipe to open.",
          visualTip: "Look at your main home screen with all your everyday apps.",
          warning: null
        },
        {
          stepNumber: 2,
          title: "Locate the Official App",
          instruction: "Find the recognized official application you need for this task.",
          visualTip: "Take your time scanning your icons; no need to rush.",
          warning: "Make sure not to tap any random pop-up advertisements."
        },
        {
          stepNumber: 3,
          title: "Follow the Guided On-Screen Prompt",
          instruction: "Read each button carefully before tapping. Look for clear buttons like 'Search', 'Pay', or 'Continue'.",
          visualTip: "Buttons usually have rounded corners and colored backgrounds.",
          warning: "Never enter your 4-digit or 6-digit secret UPI PIN unless you are paying a verified bill."
        }
      ],
      comfortingTip: "You are doing great! Technology gets easier each time you try."
    });
  } catch (error: any) {
    console.error("Task guide error:", error);
    res.status(500).json({ error: error.message || "Failed to generate task guide" });
  }
});

// Endpoint 4: Ask Saathi (Quick Questions / Senior Doubt Resolver)
app.post("/api/ask-saathi", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Question is required" });
    }

    const prompt = `You are "Saathi", a warm, loving, protective digital assistant for senior citizens.
Answer this question from a senior citizen:
"${question}"

Provide a warm, reassuring, direct response (3-4 sentences max). If it touches on security (OTP, passwords, clicking links, sharing money), strongly advise caution and explain why safely. Never use condescending words; treat them with immense respect and dignity like an esteemed elder.`;

    const textOutput = await generateWithGemini({
      contents: prompt,
      systemInstruction: "You are Saathi, a gentle, wise, protective digital companion for seniors.",
    });

    if (textOutput) {
      return res.json({ answer: textOutput });
    }

    return res.json({
      answer: "Always remember: your safety comes first. Never share your secret OTP or banking password with anyone on the phone, even if they claim to be a bank manager or police officer. If you ever feel doubtful, pause and call a trusted child or relative to confirm."
    });
  } catch (error: any) {
    console.error("Ask Saathi error:", error);
    res.status(500).json({ error: error.message || "Failed to answer question" });
  }
});

// Vite middleware in dev or static files in production
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
    console.log(`Saathi server running on http://localhost:${PORT}`);
  });
}

startServer();

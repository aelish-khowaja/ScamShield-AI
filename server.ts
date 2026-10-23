import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '5mb' }));

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey.trim().length > 0) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    model: 'gemini-3.8-flash',
  });
});

// Message Scanner Endpoint
app.post('/api/scan', async (req, res) => {
  try {
    const { messageText } = req.body;

    if (!messageText || typeof messageText !== 'string' || messageText.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide a message or email text to analyze.' });
    }

    if (messageText.length > 25000) {
      return res.status(400).json({ error: 'Message text exceeds the maximum allowed length (25,000 characters).' });
    }

    // Refresh client in case environment variable was injected
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY.trim(),
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }

    if (!aiClient) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured. Please add your GEMINI_API_KEY in the AI Studio Secrets panel.',
        missingApiKey: true,
      });
    }

    const systemPrompt = `You are ScamShield AI, an elite cybersecurity and fraud intelligence engine.
Analyze the following user-submitted message, SMS, email, job pitch, or payment request for potential scam, phishing, social engineering, or fraudulent indicators.

Adhere strictly to these principles:
1. Objectivity & Nuance: Never proclaim that every message is 100% definitively a scam or 100% safe. Always articulate risk factors, explain probabilistic uncertainty, and advise verifying via known official channels.
2. Threat Detection: Scrutinize for urgent artificial deadlines, deceptive URLs / typosquatting domains, requests for credentials, OTPs, or 2FA codes, gift card/wire/crypto demands, upfront fee job offers, impersonation of banks, tax agencies, parcel carriers, or tech support.
3. Identify exact suspicious phrases: Extract the exact snippets from the message that triggered concern, explain why they are risky, and categorize their severity ('critical', 'warning', or 'suspicious').
4. Safety Next Steps: Provide actionable steps the user should take right now, as well as clear "What NOT to do" precautions.
5. Return strictly valid JSON conforming to the requested schema.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${systemPrompt}\n\nAnalyze this message content:\n"""\n${messageText}\n"""`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: {
              type: Type.STRING,
              description: 'Must be one of: "Low", "Medium", "High"',
            },
            riskScore: {
              type: Type.INTEGER,
              description: 'Estimated risk score from 0 (very likely benign) to 100 (extreme danger)',
            },
            scamType: {
              type: Type.STRING,
              description: 'Primary category e.g., "Phishing / Credential Harvesting", "Urgent Wire/Payment Scam", "Delivery / Toll Smishing", "Fake Job / Advance Fee", "Tech Support Fraud", "Account Suspension Impersonation", "Likely Legitimate Communication"',
            },
            verdictSummary: {
              type: Type.STRING,
              description: 'A clear, high-level 1-2 sentence executive assessment in simple English.',
            },
            indicatorsFound: {
              type: Type.BOOLEAN,
              description: 'Whether active scam or risk indicators were identified.',
            },
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of specific warning indicators detected.',
            },
            safeSignals: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of mitigating factors or benign elements identified.',
            },
            suspiciousPhrases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phrase: {
                    type: Type.STRING,
                    description: 'The exact or near-exact phrase extracted from the message',
                  },
                  reason: {
                    type: Type.STRING,
                    description: 'Concise explanation why this phrase indicates danger or pressure',
                  },
                  severity: {
                    type: Type.STRING,
                    description: '"critical", "warning", or "suspicious"',
                  },
                },
                required: ['phrase', 'reason', 'severity'],
              },
              description: 'Specific risky phrases highlighted for the user',
            },
            recommendedActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Direct, practical, actionable next steps for safe handling',
            },
            whatNotToDo: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Critical warnings of what actions the user must avoid doing',
            },
            confidenceAssessment: {
              type: Type.STRING,
              description: 'A statement clarifying AI limitations, advising verification through direct official channels (e.g. typing official URL into browser, calling card back number).',
            },
          },
          required: [
            'riskLevel',
            'riskScore',
            'scamType',
            'verdictSummary',
            'indicatorsFound',
            'redFlags',
            'safeSignals',
            'suspiciousPhrases',
            'recommendedActions',
            'whatNotToDo',
            'confidenceAssessment',
          ],
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Received empty response from AI engine.');
    }

    const parsed = JSON.parse(textOutput);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error during message scan:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to complete scam analysis. Please check your network and try again.',
    });
  }
});

// AI Assistant Chatbot Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Refresh client in case environment variable was injected
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY.trim(),
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }

    if (!aiClient) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured. Please add your GEMINI_API_KEY in the AI Studio Secrets panel.',
        missingApiKey: true,
      });
    }

    const systemInstruction = `You are ScamShield AI Assistant, an empathetic, highly knowledgeable, and clear-spoken cybersecurity & consumer fraud prevention specialist.
Your mission is to help everyday users identify suspicious messages, analyze potential phishing, avoid payment & wire scams, evaluate fake job recruiters, and safeguard their digital identity.

Core guidelines:
1. Explain technical cybersecurity terms (phishing, smishing, spoofing, 2FA bypass, credential harvesting, social engineering) in simple, accessible, real-world English.
2. Provide immediate triage steps if a user shares that they already clicked a malicious link, entered a password, gave an OTP, or sent funds (e.g., immediate card lock, credit bureau fraud alerts, changing passwords from a clean device, contacting fraud departments, filing an IC3/FTC report).
3. AI Safety & Responsibility: Do NOT definitively assert that an unverified item is 100% safe. Remind users how to verify directly using bookmarked official links or the phone number printed on the physical back of their payment card.
4. Never request passwords, bank account numbers, social security numbers, or one-time passcodes (OTPs).
5. Format your answers clearly using clean bullet points, numbered actionable steps, and bold key terms so users in stressful situations can easily read and follow instructions.`;

    // Map conversation history
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I apologize, but I could not formulate a response. Please try rephrasing your question.';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Error during chat generation:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to process your question. Please try again.',
    });
  }
});

// Setup Vite middleware in development or serve static in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ScamShield AI server running at http://0.0.0.0:${PORT} [${isProduction ? 'production' : 'development'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

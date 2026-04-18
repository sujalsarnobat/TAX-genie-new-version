const { GoogleGenerativeAI } = require('@google/generative-ai');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const SYSTEM_PROMPT = `You are TaxSarthi AI — an expert Indian income tax advisor built into the TaxSarthi tax filing platform.

Your expertise covers:
- Old vs New tax regime comparison (FY 2024-25 / AY 2025-26 and earlier years)
- Section 80C, 80CCC, 80CCD(1), 80CCD(1B), 80CCD(2) deductions
- Section 80D (medical insurance), 80E (education loan), 80G (donations)
- HRA exemption calculations (Section 10(13A))
- Standard Deduction (₹75,000 for AY 2025-26, ₹50,000 for earlier)
- Section 87A rebate (₹12L new regime AY 2025-26, ₹7L for AY 2024-25)
- ITR filing procedures (ITR-1 Sahaj for salaried individuals)
- Tax notices — Section 139(9), 142(1), 143(1), 148
- Tax saving investments — ELSS, PPF, NPS, SSY, Tax-saver FDs
- House property income (Section 24 — interest deduction up to ₹2L)
- Capital gains basics (STCG/LTCG)
- TDS and Form 16 understanding

Rules:
1. Always cite the relevant section of the Income Tax Act, 1961 when applicable.
2. Keep answers concise, accurate, and in simple language.
3. Use ₹ symbol for all currency amounts. Use Indian numbering (lakhs, crores).
4. If the user asks something outside Indian income tax, politely redirect.
5. If unsure about a specific case, recommend consulting a Chartered Accountant (CA).
6. Format responses with bullet points and bold text where helpful.
7. When comparing regimes, always mention which year's rules you're using.
8. Never provide legal advice — only tax information and guidance.`;

// Lazy-init Gemini client
let genAI = null;
let model = null;

function initGemini() {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new AppError('Gemini API key not configured', 500);
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }
  return model;
}

/**
 * POST /api/chat
 * Body: { message: string, history?: Array<{ role, parts }> }
 */
exports.chat = catchAsync(async (req, res, next) => {
  const { message, history = [] } = req.body;

  if (!message || !message.trim()) {
    throw new AppError('Message is required', 400);
  }

  const geminiModel = initGemini();

  // Build chat with system context
  const chatSession = geminiModel.startChat({
    history: [
      { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
      {
        role: 'model',
        parts: [
          {
            text: 'Understood! I am TaxSarthi AI, your Indian income tax assistant. I will help you with tax queries, regime comparisons, deductions, and filing guidance. How can I help you today?',
          },
        ],
      },
      ...history,
    ],
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 1024,
    },
  });

  try {
    const result = await chatSession.sendMessage(message);
    const reply = result.response.text();

    res.status(200).json({
      status: 'success',
      reply,
    });
  } catch (aiError) {
    const errMsg = aiError.message || '';
    console.error('Gemini API error:', errMsg);

    if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('Too Many Requests')) {
      return res.status(429).json({
        status: 'error',
        message: 'AI rate limit reached. Please wait a minute and try again.',
      });
    }
    if (errMsg.includes('403') || errMsg.includes('API_KEY')) {
      return res.status(403).json({
        status: 'error',
        message: 'AI service is temporarily unavailable. Please try later.',
      });
    }
    throw aiError; // let centralized error handler take care
  }
});

/**
 * GET /api/chat/health
 * Quick check that Gemini key is configured
 */
exports.healthCheck = (req, res) => {
  res.json({
    status: process.env.GEMINI_API_KEY ? 'ready' : 'no-api-key',
    model: 'gemini-2.5-flash',
  });
};

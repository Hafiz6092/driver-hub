import { GoogleGenAI } from '@google/genai';

// Reuse one shared day-name list anywhere we need to turn a date into a readable day.
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Returns an accurate, month-specific demand narrative instead of a single
// hardcoded "it's summer" story. monthIndex is 0-11 (JS Date getMonth()).
const getSeasonalDemandContext = (monthIndex) => {
  if (monthIndex === 11 || monthIndex === 0 || monthIndex === 1) {
    const isHolidayStretch = monthIndex === 11;
    return isHolidayStretch
      ? `It's the holiday season, historically one of the busiest stretches of the year. Expect strong demand from holiday shopping, parties, and travel, with New Year's Eve typically the single biggest earning night. Airport runs are more consistent due to holiday travel.`
      : `It's the post-holiday period (Jan/Feb). Demand often dips after New Year's as spending slows down, but cold, snowy, or icy conditions can create reliable surges since riders avoid walking or transit. Watch for winter weather spikes.`;
  }

  if (monthIndex >= 2 && monthIndex <= 4) {
    return `It's spring. Demand is generally moderate and trending upward as the weather improves and event/travel activity picks back up. Watch for demand bumps around spring events, graduations, and improving weather driving people back out at night.`;
  }

  if (monthIndex >= 5 && monthIndex <= 7) {
    return `It's summer, historically one of the slower stretches for rideshare in most markets. School is out (fewer campus trips), many riders travel or work remotely, and corporate commuting dips. Airport runs may be less consistent. Evening/weekend trips and beach or event-adjacent areas tend to hold up better than weekday commute hours.`;
  }

  return `It's fall. Demand typically picks back up as school and work routines resume and commuting normalizes. Expect steadier weekday demand, with a ramp toward the holiday season starting in November.`;
};

/**
 * Feeds chat log and shift history to Gemini. This file runs ONLY on Vercel's
 * server (anything under /api is never bundled into the client), so it is the
 * one place safe to read the real Gemini API key from process.env.
 */
const askDriverAssistant = async (userMessage, chatHistory, shifts, apiKey, currentWeatherData = null) => {
  const ai = new GoogleGenAI({ apiKey });

  const today = new Date();
  const currentMonthName = today.toLocaleString('default', { month: 'long' });
  const currentDayOfWeek = DAYS[today.getDay()];
  const formattedDate = today.toISOString().split('T')[0];
  const seasonalDemandContext = getSeasonalDemandContext(today.getMonth());

  const historySummary = (shifts || []).map(s =>
    `Date: ${s.date}, Platform: ${s.platform}, Hours: ${s.hours}, Earnings: $${s.earnings}, Expenses: $${s.expenses}`
  ).join('\n');

  const systemInstruction = `
    You are "Driver Hub AI", a tactical and direct assistant for NYC rideshare drivers.

    ENVIRONMENT METRICS:
    - Current Date: ${formattedDate} (${currentDayOfWeek}, Month of ${currentMonthName})
    - Seasonal Demand Context: ${seasonalDemandContext}

    CRITICAL BEHAVIOR RULES:
    1. IF THE DRIVER ASKS ABOUT WEATHER CONDITIONS OR CURRENT DRIVING CONDITIONS FOR TODAY:
       - You MUST explicitly direct them to look at the specialized Weather Card located right above on their dashboard interface.
       - Politely inform them that the most accurate, real-time local weather stats (temperature, precipitation, wind speeds) are actively displayed in that panel for their convenience.
       - Do NOT invent or hallucinate custom weather metrics.
    2. If the driver asks "How's work today?", "Is it busy?", or about seasonal demand:
       - Use the "Seasonal Demand Context" above as the factual basis for your answer. Give concrete, actionable advice (e.g. target areas, times of day, or event-driven opportunities) based on that context.
    3. If the driver asks about NYC traffic conditions or driving status:
       - Provide actionable insights into NYC's chronic bottlenecks. Detail typical trouble spots based on the time of day: outer borough bridge crossways (BQE, Midtown Tunnel lines, George Washington upper levels) and Manhattan core grids (FDR Drive, West Side Highway delays, and cross-streets 34th/42nd blocks). Tell them to check their turn-by-turn navigation overlay (Waze/Google Maps) for immediate blockages. Do not claim to know live incident data yourself.

    DRIVER LOG METRICS CURRENTLY AVAILABLE:
    ${!shifts || shifts.length === 0 ? "No records recorded yet." : historySummary}
  `;

  const formattedContents = [
    ...(chatHistory || []).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })),
    {
      role: 'user',
      parts: [{ text: userMessage }]
    }
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: formattedContents,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.6,
    }
  });

  return response.text;
};

// Vercel serverless function handler — this is what actually runs when the
// frontend calls fetch('/api/assistant').
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userMessage, chatHistory, shifts, currentWeatherData } = req.body || {};

  if (!userMessage) {
    return res.status(400).json({ error: 'userMessage is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY; // set in Vercel dashboard, never in frontend code

  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set in the server environment.');
    return res.status(500).json({ error: 'Server misconfigured: missing API key' });
  }

  try {
    const reply = await askDriverAssistant(userMessage, chatHistory, shifts, apiKey, currentWeatherData);
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Gemini Assistant Error:', error);
    return res.status(500).json({
      reply: "Sorry, I ran into an error pulling those insights. Double check your API connection and try again."
    });
  }
}
import { GoogleGenAI } from '@google/genai';

// Every weekly calculation in the app uses Monday as the start of the week.
const getStartOfWeek = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDay();

  // Sunday is 0 in JavaScript, so it needs a custom adjustment here.
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(new Date(date).setDate(diff));
  return monday.toISOString().split('T')[0];
};

// Reuse one shared day-name list anywhere we need to turn a date into a readable day.
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const getExpenseTotals = (shift) => {
  // Newer shift entries store expenses as an array of objects like:
  // { amount: 20, type: 'Gas' }
  const expenseItems = Array.isArray(shift.expenseItems) ? shift.expenseItems : [];

  // Reduce that array into grouped totals so other helpers do not have to repeat the same logic.
  const totals = expenseItems.reduce(
    (acc, item) => {
      const amount = Number(item.amount || 0);

      if (item.type === 'Gas') acc.gas += amount;
      else if (item.type === 'Tolls') acc.tolls += amount;
      else acc.otherExpenses += amount;

      return acc;
    },
    { gas: 0, tolls: 0, otherExpenses: 0 }
  );

  const trackedExpenses = totals.gas + totals.tolls + totals.otherExpenses;
  const fallbackExpenses = Number(shift.expenses || 0);

  return {
    gas: totals.gas,
    tolls: totals.tolls,
    otherExpenses: totals.otherExpenses,
    // Older shift entries only have the combined expenses field, so use it as a fallback.
    total: trackedExpenses > 0 ? trackedExpenses : fallbackExpenses
  };
};

export const sortShiftsByMostRecent = (shifts) => {
  // Clone first so we do not mutate the original state array.
  return [...shifts].sort((a, b) => {
    const dateCompare = new Date(b.date) - new Date(a.date);

    if (dateCompare !== 0) {
      return dateCompare;
    }

    // If two shifts are on the same date, use the generated id as the tiebreaker.
    return Number(b.id || 0) - Number(a.id || 0);
  });
};

export const calculateWeeklyBreakdown = (shifts) => {
  const weeklyData = {};

  shifts.forEach((shift) => {
    const weekStarting = getStartOfWeek(shift.date);
    const dateObj = new Date(shift.date);
    const dayName = DAYS[dateObj.getDay()];
    const expenses = getExpenseTotals(shift);

    // Create the parent week bucket the first time we see that week.
    if (!weeklyData[weekStarting]) {
      weeklyData[weekStarting] = {
        weekLabel: weekStarting,
        shiftCount: 0,
        days: {}
      };
    }

    // Track how many shifts belong to the week.
    // The dashboard uses this to find the busiest week.
    weeklyData[weekStarting].shiftCount += 1;

    // Each weekday inside a week gets its own running totals object.
    if (!weeklyData[weekStarting].days[dayName]) {
      weeklyData[weekStarting].days[dayName] = {
        earnings: 0,
        hours: 0,
        expenses: 0,
        gas: 0,
        tolls: 0,
        otherExpenses: 0,
        date: shift.date
      };
    }

    // Add this shift into the correct week/day bucket.
    weeklyData[weekStarting].days[dayName].earnings += Number(shift.earnings || 0);
    weeklyData[weekStarting].days[dayName].hours += Number(shift.hours || 0);
    weeklyData[weekStarting].days[dayName].expenses += expenses.total;
    weeklyData[weekStarting].days[dayName].gas += expenses.gas;
    weeklyData[weekStarting].days[dayName].tolls += expenses.tolls;
    weeklyData[weekStarting].days[dayName].otherExpenses += expenses.otherExpenses;
  });

  return weeklyData;
};

export const getWeekWithMostShifts = (shifts) => {
  const weeklyData = calculateWeeklyBreakdown(shifts);
  const weekKeys = Object.keys(weeklyData);

  if (weekKeys.length === 0) {
    return null;
  }

  return weekKeys.reduce((bestWeek, currentWeek) => {
    if (!bestWeek) {
      return currentWeek;
    }

    const bestCount = weeklyData[bestWeek].shiftCount || 0;
    const currentCount = weeklyData[currentWeek].shiftCount || 0;

    if (currentCount > bestCount) {
      return currentWeek;
    }

    // If two weeks have the same shift count, prefer the newer one.
    if (currentCount === bestCount && currentWeek > bestWeek) {
      return currentWeek;
    }

    return bestWeek;
  }, null);
};

export const generateWeeklyInsights = (shifts) => {
  // Show placeholder copy until the app has enough data to say anything useful.
  if (!shifts || shifts.length === 0) {
    return [
      'Log a few shifts to unlock weekly AI insights.',
      'Once you have data, this panel will highlight your best days, strongest platform, and expense trends.'
    ];
  }

  const weeklyData = calculateWeeklyBreakdown(shifts);

  // The insights card focuses on the latest logged week, not the busiest one.
  const latestWeekStart = Object.keys(weeklyData).sort().reverse()[0];
  const latestWeek = weeklyData[latestWeekStart];
  const latestWeekDays = latestWeek ? Object.values(latestWeek.days) : [];

  // Collapse that week into one totals object for the summary sentences.
  const latestWeekTotals = latestWeekDays.reduce(
    (acc, day) => {
      acc.earnings += Number(day.earnings || 0);
      acc.hours += Number(day.hours || 0);
      acc.expenses += Number(day.expenses || 0);
      acc.gas += Number(day.gas || 0);
      acc.tolls += Number(day.tolls || 0);
      return acc;
    },
    { earnings: 0, hours: 0, expenses: 0, gas: 0, tolls: 0 }
  );

  // Find the single highest-earning shift day in the whole data set.
  const bestDay = shifts.reduce((best, shift) => {
    const dayName = DAYS[new Date(shift.date).getDay()];
    const earnings = Number(shift.earnings || 0);

    if (!best || earnings > best.earnings) {
      return { dayName, earnings, date: shift.date };
    }

    return best;
  }, null);

  // Group shifts by platform so we can compare Uber vs Lyft hourly performance.
  const platformStats = shifts.reduce((acc, shift) => {
    const platform = shift.platform || 'Unknown';

    if (!acc[platform]) {
      acc[platform] = { earnings: 0, hours: 0 };
    }

    acc[platform].earnings += Number(shift.earnings || 0);
    acc[platform].hours += Number(shift.hours || 0);
    return acc;
  }, {});

  const bestPlatform = Object.entries(platformStats).reduce((best, [platform, stats]) => {
    const hourlyRate = stats.hours > 0 ? stats.earnings / stats.hours : 0;

    if (!best || hourlyRate > best.hourlyRate) {
      return { platform, hourlyRate };
    }

    return best;
  }, null);

  const latestWeekNet = latestWeekTotals.earnings - latestWeekTotals.expenses;
  const latestWeekHourly = latestWeekTotals.hours > 0
    ? latestWeekNet / latestWeekTotals.hours
    : 0;

  // Expense share helps us decide whether gas or tolls is the bigger problem this week.
  const gasShare = latestWeekTotals.expenses > 0
    ? (latestWeekTotals.gas / latestWeekTotals.expenses) * 100
    : 0;

  const tollShare = latestWeekTotals.expenses > 0
    ? (latestWeekTotals.tolls / latestWeekTotals.expenses) * 100
    : 0;

  const insights = [];

  if (latestWeek && latestWeekTotals.earnings > 0) {
    insights.push(
      `For the week of ${latestWeekStart}, you brought in $${latestWeekTotals.earnings.toLocaleString()} and kept $${latestWeekNet.toLocaleString()} net.`
    );
    insights.push(
      `Your take-home pace this week was $${latestWeekHourly.toFixed(2)}/hr after expenses.`
    );
  }

  if (bestDay) {
    insights.push(
      `Your best single earning day so far was ${bestDay.dayName} (${bestDay.date}), bringing in $${bestDay.earnings.toLocaleString()}.`
    );
  }

  if (bestPlatform) {
    insights.push(
      `${bestPlatform.platform} is your strongest platform right now at an average of $${bestPlatform.hourlyRate.toFixed(2)}/hr gross.`
    );
  }

  if (latestWeekTotals.expenses > 0) {
    if (tollShare > gasShare) {
      insights.push(
        `Tolls made up ${tollShare.toFixed(0)}% of this week's expenses, so route choice looks like the biggest profit lever.`
      );
    } else {
      insights.push(
        `Gas made up ${gasShare.toFixed(0)}% of this week's expenses, so fuel-efficient hours and areas should help your margin most.`
      );
    }
  } else {
    insights.push('You logged zero expenses this week, so every dollar earned stayed in your top-line profit.');
  }

  // Keep the card short enough to scan quickly.
  return insights.slice(0, 4);
};

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
 * Feeds chat log, live weather data, and NYC regional traffic conditions to Gemini
 *
 * SECURITY NOTE: `apiKey` must never be a key that is shipped to the browser.
 * If this function is called directly from client-side React code with a key
 * bundled into the frontend, that key is visible to anyone via devtools/network
 * tab and can be extracted and abused. Instead, this function should run on a
 * backend/server route (e.g. an API endpoint your React app calls), with the
 * Gemini API key read from a server-side environment variable. The client
 * should only ever call your own backend endpoint, never the Gemini API directly.
 */
export const askDriverAssistant = async (userMessage, chatHistory, shifts, apiKey, currentWeatherData = null) => {
  const ai = new GoogleGenAI({ apiKey });

  const today = new Date();
  const currentMonthName = today.toLocaleString('default', { month: 'long' });
  const currentDayOfWeek = DAYS[today.getDay()];
  const formattedDate = today.toISOString().split('T')[0];
  const seasonalDemandContext = getSeasonalDemandContext(today.getMonth());

  const historySummary = shifts.map(s =>
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
    ${shifts.length === 0 ? "No records recorded yet." : historySummary}
  `;

  const formattedContents = [
    ...chatHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })),
    {
      role: 'user',
      parts: [{ text: userMessage }]
    }
  ];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.6,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Assistant Error:", error);
    return "Sorry, I ran into an error pulling those insights. Double check your API connection and try again.";
  }
};
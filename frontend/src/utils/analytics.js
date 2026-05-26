// Helper function to get the start of the week (Monday)
const getStartOfWeek = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    // This math ensures that even if you work on a Sunday, it finds the previous Monday
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    return monday.toISOString().split('T')[0];
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const getExpenseTotals = (shift) => {
    const expenseItems = Array.isArray(shift.expenseItems) ? shift.expenseItems : [];

    const totals = expenseItems.reduce((acc, item) => {
        const amount = Number(item.amount || 0);

        if (item.type === 'Gas') acc.gas += amount;
        else if (item.type === 'Tolls') acc.tolls += amount;
        else acc.otherExpenses += amount;

        return acc;
    }, { gas: 0, tolls: 0, otherExpenses: 0 });

    const trackedExpenses = totals.gas + totals.tolls + totals.otherExpenses;
    const fallbackExpenses = Number(shift.expenses || 0);

    return {
        gas: totals.gas,
        tolls: totals.tolls,
        otherExpenses: totals.otherExpenses,
        total: trackedExpenses > 0 ? trackedExpenses : fallbackExpenses
    };
};

export const sortShiftsByMostRecent = (shifts) => {
    return [...shifts].sort((a, b) => {
        const dateCompare = new Date(b.date) - new Date(a.date);

        if (dateCompare !== 0) {
            return dateCompare;
        }

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

        if (!weeklyData[weekStarting]) {
            weeklyData[weekStarting] = {
                weekLabel: weekStarting,
                shiftCount: 0,
                days: {}
            };
        }

        weeklyData[weekStarting].shiftCount += 1;

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

        if (currentCount === bestCount && currentWeek > bestWeek) {
            return currentWeek;
        }

        return bestWeek;
    }, null);
};

export const generateWeeklyInsights = (shifts) => {
    if (!shifts || shifts.length === 0) {
        return [
            'Log a few shifts to unlock weekly AI insights.',
            'Once you have data, this panel will highlight your best days, strongest platform, and expense trends.'
        ];
    }

    const weeklyData = calculateWeeklyBreakdown(shifts);
    const latestWeekStart = Object.keys(weeklyData).sort().reverse()[0];
    const latestWeek = weeklyData[latestWeekStart];
    const latestWeekDays = latestWeek ? Object.values(latestWeek.days) : [];

    const latestWeekTotals = latestWeekDays.reduce((acc, day) => {
        acc.earnings += Number(day.earnings || 0);
        acc.hours += Number(day.hours || 0);
        acc.expenses += Number(day.expenses || 0);
        acc.gas += Number(day.gas || 0);
        acc.tolls += Number(day.tolls || 0);
        return acc;
    }, { earnings: 0, hours: 0, expenses: 0, gas: 0, tolls: 0 });

    const bestDay = shifts.reduce((best, shift) => {
        const dayName = DAYS[new Date(shift.date).getDay()];
        const earnings = Number(shift.earnings || 0);

        if (!best || earnings > best.earnings) {
            return { dayName, earnings };
        }

        return best;
    }, null);

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
            `Your best single earning day so far was ${bestDay.dayName}, bringing in $${bestDay.earnings.toLocaleString()}.`
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

    return insights.slice(0, 4);
};

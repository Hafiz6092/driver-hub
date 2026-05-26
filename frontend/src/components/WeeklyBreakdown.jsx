import { calculateWeeklyBreakdown } from '../utils/analytics';
import { formatDate } from '../utils/formatters';

const WeeklyBreakdown = ({
  shifts,
  weekStarts,
  title = 'Weekly Breakdown',
  emptyMessage = 'No weekly shift data yet.',
  className = 'mt-8 space-y-4'
}) => {
  const weeklyData = calculateWeeklyBreakdown(shifts);
  const availableWeekKeys = Object.keys(weeklyData).sort().reverse();
  const weekKeys = Array.isArray(weekStarts) && weekStarts.length > 0
    ? availableWeekKeys.filter((weekStart) => weekStarts.includes(weekStart))
    : availableWeekKeys;

  if (weekKeys.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
        <p className="text-slate-500 italic">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
      {weekKeys.map((weekStart) => (
        <div key={weekStart} className="bg-white p-6 rounded-xl shadow-xl text-shadow-sm hover:shadow-blue-500 shadow-blue-500/70 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
            Week of {formatDate(weekStart)}
          </h3>

          <div className="space-y-3">
            {Object.keys(weeklyData[weekStart].days).map((dayName) => {
              const { earnings, hours, date } = weeklyData[weekStart].days[dayName];
              const hourlyRate = hours > 0 ? (earnings / hours).toFixed(2) : 0;

              return (
                <div key={date} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div>
                    <span className="font-semibold text-slate-700">
                      {dayName} <span className="text-xs text-slate-400 font-normal">- {formatDate(date)}</span>
                    </span>
                    <p className="text-xs text-slate-500">{hours} hrs</p>
                  </div>
                  <div className="text-right">
                    <span className="text-green-600 font-bold">${earnings}</span>
                    <p className="text-xs text-blue-500">${hourlyRate}/hr</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeeklyBreakdown;
